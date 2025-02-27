using Backend.DAOs;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Task = Backend.Models.Task;

namespace Backend.Repositories
{
    public class TaskRepository : TaskDao
    {
        public TaskRepository(ApplicationDbContext context) : base(context)
        {
        }
        
        public async Task<List<Task>> ListTasks(TaskFilterDto? filtroDto, int usuarioId)
        {
            try
            {
                return await base.List(usuarioId, filtroDto);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao listar tarefas: {ex.Message}", ex);
            }
        }
        
        public async Task<List<Task>> ListTasks(int usuarioId)
        {
            try
            {
                return await base.List(usuarioId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao listar tarefas: {ex.Message}", ex);
            }
        }

        public async Task<int> InsertTask(Task task)
        {
            try
            {
                await base.Insert(task);
                return task.Id;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao inserir tarefa: {ex.Message}", ex);
            } 
        }

        public async Task<int> DeleteTask(int id)
        {
            try
            {
                Task? taskExists = await base.GetById(id);
                
                if (taskExists == null)
                {
                    throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada.");
                }
                
                return await base.Delete(taskExists);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<int> RenameTask(int id, string newDescription)
        {
            try
            {
                Task? taskExists = await base.GetById(id);

                if (taskExists == null)
                {
                    throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada.");
                }
                
                taskExists.Description = newDescription;
                
                return await base.Rename(taskExists);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<int> ReorderTask(List<Task> tarefas)
        {
            try
            {
                return await base.Reorder(tarefas);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<int> ChangeStatus(int id)
        {
            try
            {
                Task? taskExists = await base.GetById(id);

                if (taskExists == null)
                {
                    throw new KeyNotFoundException($"Tarefa com ID {id} não encontrada.");
                }
                
                return await base.Status(taskExists);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }
    }
}
