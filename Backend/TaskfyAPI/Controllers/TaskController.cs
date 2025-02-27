using System.Security.Claims;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task = Backend.Models.Task;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly TaskRepository _taskRepository;

        public TaskController(TaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }
        
        [HttpGet("List")]
        public async Task<IActionResult> List([FromQuery] TaskFilterDto? filter = null)
        {
            List<Task> tarefas = await _taskRepository.ListTasks(filter, GetUserId());
            return Ok(tarefas);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Task task)
        {
            try
            {
                task.UserId = GetUserId();
                
                await _taskRepository.InsertTask(task);
                return CreatedAtAction(nameof(Insert), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao inserir a tarefa: " + ex.Message);
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _taskRepository.DeleteTask(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao remover a tarefa: " + ex.Message);
            }
        }

        [HttpPatch("Rename/{id}")]
        public async Task<IActionResult> Rename(int id, [FromBody] TaskRenameDto dados)
        {
            if (string.IsNullOrEmpty(dados.Description)) return BadRequest("Descrição não pode ser vazia.");
            
            try
            {
                await _taskRepository.RenameTask(id, dados.Description);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao alterar a tarefa: " + ex.Message);
            }
        }

        [HttpPut("Reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<Task> tarefas)
        {
            try
            {
                await _taskRepository.ReorderTask(tarefas);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao alterar ordem da tarefa: " + ex.Message);
            }
        }

        [HttpPatch("ChangeStatus/{id}")]
        public async Task<IActionResult> ChangeStatus(int id)
        {
            try
            {
                await _taskRepository.ChangeStatus(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao alterar status da tarefa: " + ex.Message);
            }
        }
        
        private int GetUserId() => Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}