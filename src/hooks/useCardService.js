
export default function useCardService({
  removeCard,
  handleCardDeleted,
}) {
  function deleteCard(id) {
    // Remove the actual card.
    removeCard(id);

    // Clean up selection and history.
    handleCardDeleted(id);
  }

  return {
    deleteCard,
  };
}