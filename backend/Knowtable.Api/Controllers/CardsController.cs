using Knowtable.Api.Models;
using Knowtable.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Knowtable.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId:guid}/cards")]
public sealed class CardsController : ControllerBase
{
    private readonly StorageOrchestrator _storage;

    public CardsController(StorageOrchestrator storage)
    {
        _storage = storage;
    }

    [HttpPost]
    public async Task<ActionResult<CardDto>> Create(
        Guid projectId,
        CreateCardRequest request,
        CancellationToken cancellationToken)
    {
        var card = await _storage.CreateCardAsync(
            projectId, request.X, request.Y, cancellationToken);

        if (card is null)
            return NotFound("Project not found.");

        return Ok(card);
    }
    
    [HttpPut("{cardId:guid}/autosave")]
    public async Task<ActionResult<CardDto>> Autosave(
        Guid projectId,
        Guid cardId,
        CardDto card,
        CancellationToken cancellationToken)
    {
        if (card.Id != cardId)
            return BadRequest("Card ID does not match the route.");

        var result = await _storage.AutosaveCardAsync(
            projectId, card, cancellationToken);

        return Ok(result);
    }

    [HttpPost("{cardId:guid}/save")]
    public async Task<ActionResult<CardDto>> Save(
        Guid projectId,
        Guid cardId,
        CardDto card,
        CancellationToken cancellationToken)
    {
        if (card.Id != cardId)
            return BadRequest("Card ID does not match the route.");

        var result = await _storage.SaveCardAsync(
            projectId, card, cancellationToken);

        return Ok(result);
    }

    [HttpPost("{cardId:guid}/revert")]
    public async Task<ActionResult<CardDto>> Revert(
        Guid projectId,
        Guid cardId,
        CardDto card,
        CancellationToken cancellationToken)
    {
        if (card.Id != cardId)
            return BadRequest("Card ID does not match the route.");

        var result = await _storage.RevertCardAsync(
            projectId, card, cancellationToken);

        return Ok(result);
    }
}