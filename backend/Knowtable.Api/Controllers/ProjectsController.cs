


using Knowtable.Api.Models;
using Knowtable.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Knowtable.Api.Controllers;

[ApiController]
[Route("api/projects")]
public sealed class ProjectsController : ControllerBase
{
    private readonly StorageOrchestrator _storage;

    public ProjectsController(StorageOrchestrator storage)
    {
        _storage = storage;
    }

    [HttpGet("draft")]
    public async Task<ActionResult<ProjectDto>> GetDraft(
        CancellationToken cancellationToken)
    {
        var draft = await _storage.LoadDraftProjectAsync(
            cancellationToken);

        return Ok(draft);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectDocument>>> ListProjects(
        CancellationToken cancellationToken)
    {
        var projects = await _storage.ListProjectsAsync(cancellationToken);
        return Ok(projects);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(
        CancellationToken cancellationToken)
    {
        var project = await _storage.CreateProjectAsync(
            cancellationToken);

        return CreatedAtAction(
            nameof(GetProject),
            new { projectId = project.Id },
            project);
    }

    [HttpPost("draft/save")]
    public async Task<ActionResult<ProjectDto>> SaveDraftProject(
        ProjectDto draft,
        CancellationToken cancellationToken)
    {
        if (draft.Id != Guid.Empty)
            return BadRequest("This endpoint only accepts new drafts.");

        var project = await _storage.SaveDraftProjectAsync(
            draft, cancellationToken);

        return CreatedAtAction(
            nameof(GetProject),
            new { projectId = project.Id },
            project);
    }

    [HttpPost("{projectId:guid}/save")]
    public async Task<ActionResult<ProjectDto>> SaveProject(
        Guid projectId,
        ProjectDto project,
        CancellationToken cancellationToken)
    {
        if (project.Id != projectId)
            return BadRequest("Project ID does not match the route.");

        var result = await _storage.SaveProjectAsync(
            project, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{projectId:guid}")]
    public async Task<ActionResult<ProjectDto>> GetProject(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        var project = await _storage.LoadProjectAsync(
            projectId,
            cancellationToken);

        if (project is null)
            return NotFound();

        return Ok(project);
    }

    [HttpPut("{projectId:guid}")]
    public async Task<ActionResult<ProjectDto>> AutosaveProjectLayout(
        Guid projectId,
        ProjectDto project,
        CancellationToken cancellationToken)
    {
        if (project.Id != projectId)
            return BadRequest("The project ID does not match the route.");

        await _storage.AutosaveProjectLayoutAsync(
            project,
            cancellationToken);

        return Ok(project);
    }
}
