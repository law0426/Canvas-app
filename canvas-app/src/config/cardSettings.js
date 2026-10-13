// Default card dimensions
export const DEFAULT_CARD_WIDTH = 240;
export const DEFAULT_CARD_HEIGHT = 180;

// Minimum dimensions while resizing
export const MIN_CARD_WIDTH = 120;
export const MIN_CARD_HEIGHT = 100;


// Resize sizing modes
export const RESIZE_SIZE_MODE = Object.freeze({
    FIXED: "fixed",
    RELATIVE: "relative",
    BOUNDED: "bounded",
    BOUNDED_MIN: "bounded_min",
    BOUNDED_MAX: "bounded_max",
});


// Mode matrix: which settings each mode uses
export const RESIZE_SIZE_MODE_MATRIX = Object.freeze({
    [RESIZE_SIZE_MODE.FIXED]: {
        usesPx: true,
        usesPercentage: false,
        usesMinimum: false,
        usesMaximum: false,
    },
    [RESIZE_SIZE_MODE.RELATIVE]: {
        usesPx: false,
        usesPercentage: true,
        usesMinimum: false,
        usesMaximum: false,
    },
    [RESIZE_SIZE_MODE.BOUNDED]: {
        usesPx: false,
        usesPercentage: true,
        usesMinimum: true,
        usesMaximum: true,
    },
    [RESIZE_SIZE_MODE.BOUNDED_MIN]: {
        usesPx: false,
        usesPercentage: true,
        usesMinimum: true,
        usesMaximum: false,
    },
    [RESIZE_SIZE_MODE.BOUNDED_MAX]: {
        usesPx: false,
        usesPercentage: true,
        usesMinimum: false,
        usesMaximum: true,
    },
});


// Edge-length settings
export const RESIZE_EDGE_LENGTH_MODE = RESIZE_SIZE_MODE.BOUNDED;

export const RESIZE_EDGE_LENGTH_PX = 32;
export const RESIZE_EDGE_LENGTH_PERCENT = 25;

export const RESIZE_EDGE_LENGTH_MIN_PX = 20;
export const RESIZE_EDGE_LENGTH_MAX_PX = 200;

if (RESIZE_EDGE_LENGTH_MIN_PX > RESIZE_EDGE_LENGTH_MAX_PX) {
    throw new Error(
        "Resize edge minimum cannot exceed its maximum."
    );
}

// Inherited sizing
export const INHERIT_RESIZE_HANDLE_SIZES = false;

export const RESIZE_CORNER_RATIO = 0.6;
export const RESIZE_EDGE_THICKNESS_RATIO = 0.55;


// Independent sizes used when inheritance is disabled
export const RESIZE_CORNER_SIZE_PX = 24;
export const RESIZE_EDGE_THICKNESS_PX = 18;


// Calculate the length of an edge handle.
// The dimension is card width for top/bottom handles,
// and card height for left/right handles.
export function getResizeEdgeLength(dimensionPx) {
    const mode = RESIZE_SIZE_MODE_MATRIX[RESIZE_EDGE_LENGTH_MODE];

    if (!mode) {
        throw new Error(
            `Unsupported resize size mode: ${RESIZE_EDGE_LENGTH_MODE}`
        );
    }

    // Fixed mode ignores percentages and bounds.
    if (mode.usesPx) {
        return RESIZE_EDGE_LENGTH_PX;
    }

    let length = dimensionPx * RESIZE_EDGE_LENGTH_PERCENT / 100;

    if (mode.usesMinimum) {
        length = Math.max(length, RESIZE_EDGE_LENGTH_MIN_PX);
    }

    if (mode.usesMaximum) {
        length = Math.min(length, RESIZE_EDGE_LENGTH_MAX_PX);
    }

    return length;
}


// Calculate all resize-handle dimensions for a card.
export function getResizeHandleSizes(
    cardWidth = DEFAULT_CARD_WIDTH,
    cardHeight = DEFAULT_CARD_HEIGHT
) {
    const horizontalEdgeLength = getResizeEdgeLength(cardWidth);
    const verticalEdgeLength = getResizeEdgeLength(cardHeight);

    // Corners inherit from the average of both edge lengths.
    const averageEdgeLength =
        (horizontalEdgeLength + verticalEdgeLength) / 2;

    return {
        horizontalEdgeLength,
        verticalEdgeLength,

        cornerSize: INHERIT_RESIZE_HANDLE_SIZES
            ? averageEdgeLength * RESIZE_CORNER_RATIO
            : RESIZE_CORNER_SIZE_PX,

        horizontalEdgeThickness: INHERIT_RESIZE_HANDLE_SIZES
            ? horizontalEdgeLength * RESIZE_EDGE_THICKNESS_RATIO
            : RESIZE_EDGE_THICKNESS_PX,

        verticalEdgeThickness: INHERIT_RESIZE_HANDLE_SIZES
            ? verticalEdgeLength * RESIZE_EDGE_THICKNESS_RATIO
            : RESIZE_EDGE_THICKNESS_PX,
    };
}


// Temporary compatibility exports for the current Card.jsx.
// We'll remove these once Card.jsx uses getResizeHandleSizes().
export const RESIZE_CORNER_SIZE = RESIZE_CORNER_SIZE_PX;
export const RESIZE_EDGE_LENGTH = RESIZE_EDGE_LENGTH_PX;
export const RESIZE_EDGE_THICKNESS = RESIZE_EDGE_THICKNESS_PX;