using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Task = Backend.Models.Task;

namespace Backend.DAOs
{
    public class TaskDao
    {
        private readonly ApplicationDbContext _context;

        protected TaskDao(ApplicationDbContext context)
        {
            _context = context;
        }

        protected async Task<Task?> GetById(int id)
        {
            var tarefa = await _context.Tasks.FindAsync(id);
            return tarefa;
        }

        protected async Task<List<Task>> List(int userId, TaskFilterDto? filter = null)
        {
            IQueryable<Task> query = _context.Tasks.AsQueryable();

            query = query.Where(t => t.UserId == userId && t.Active == true).OrderBy(d => d.Order);

            if (filter != null)
            {
                if (filter.Id > 0)
                {
                    query = query.Where(t => t.Id == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.Description))
                {
                    query = query.Where(t => t.Description.Contains(filter.Description));
                }

                if (filter.IsCompleted.HasValue)
                {
                    query = query.Where(t => t.IsCompleted == filter.IsCompleted);
                }
            }

            return await query.ToListAsync();
        }

        protected async Task<int> Insert(Task task)
        {
            int maxOrder = await _context.Tasks.Where(t => t.Active && t.UserId == task.UserId)
                .MaxAsync(t => (int?)t.Order) ?? 0;

            task.Order = maxOrder + 1;

            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
            return task.Id;
        }

        protected async Task<int> Delete(Task task)
        {
            List<Task> tarefas = await _context.Tasks.Where(t => t.Active && t.UserId == task.UserId).ToListAsync();
            tarefas.ForEach(t =>
            {
                if (t.Order > task.Order)
                {
                    t.Order -= 1;
                }
            });
            
            task.Active = false;
            
            _context.Tasks.Update(task);
            return await _context.SaveChangesAsync();
        }

        protected async Task<int> Rename(Task task)
        {
            _context.Tasks.Update(task);
            return await _context.SaveChangesAsync();
        }

        protected async Task<int> Reorder(List<Task> reorderedTasks)
        {
            int userId = reorderedTasks.FirstOrDefault()!.UserId;
            
            List<Task> tarefas = await _context.Tasks.Where(t => t.Active && t.UserId == userId).ToListAsync();
            tarefas.ForEach(t => t.Order = reorderedTasks.FindIndex(x => x.Id == t.Id) + 1);
            
            return await _context.SaveChangesAsync();
        }

        protected async Task<int> Status(Task task)
        {
            task.IsCompleted = !task.IsCompleted;

            _context.Tasks.Update(task);
            return await _context.SaveChangesAsync();
        }
    }
}