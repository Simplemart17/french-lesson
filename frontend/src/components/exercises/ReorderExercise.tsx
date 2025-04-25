import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ReorderExerciseProps {
  question: string;
  sentences: string[];
  onComplete: (isCorrect: boolean) => void;
}

const ReorderExercise = ({ 
  question, 
  sentences, 
  onComplete 
}: ReorderExerciseProps) => {
  const [shuffledSentences, setShuffledSentences] = useState<{id: number, text: string}[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  
  // Initialize the exercise
  useEffect(() => {
    // Add IDs to sentences and shuffle them
    const sentencesWithIds = sentences.map((text, index) => ({
      id: index,
      text
    }));
    
    const shuffled = [...sentencesWithIds].sort(() => Math.random() - 0.5);
    setShuffledSentences(shuffled);
  }, [sentences]);
  
  const handleDragStart = (id: number) => {
    setDraggedItem(id);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null) return;
    
    // Find the current index of the dragged item
    const dragIndex = userOrder.indexOf(draggedItem);
    
    // If the item is not in the user order yet, add it
    if (dragIndex === -1) {
      // Add the item at the drop position
      const newOrder = [...userOrder];
      newOrder.splice(dropIndex, 0, draggedItem);
      setUserOrder(newOrder);
    } else {
      // Move the item from its current position to the drop position
      const newOrder = [...userOrder];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);
      setUserOrder(newOrder);
    }
    
    setDraggedItem(null);
  };
  
  const handleItemClick = (id: number) => {
    if (isSubmitted) return;
    
    // If the item is already in the user order, remove it
    if (userOrder.includes(id)) {
      setUserOrder(userOrder.filter(itemId => itemId !== id));
    } else {
      // Otherwise, add it to the end
      setUserOrder([...userOrder, id]);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Check if the user order matches the correct order
    const isCorrect = userOrder.every((id, index) => id === index);
    onComplete(isCorrect);
  };
  
  const resetExercise = () => {
    setUserOrder([]);
    setIsSubmitted(false);
    
    // Reshuffle the sentences
    const shuffled = [...shuffledSentences].sort(() => Math.random() - 0.5);
    setShuffledSentences(shuffled);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">{question}</h3>
      
      {/* User's ordered sentences */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="mb-3 font-medium text-gray-700">Arrange the sentences in the correct order:</h4>
        
        <div className="space-y-2 min-h-[100px]">
          {userOrder.length === 0 ? (
            <div 
              className="p-4 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg"
              onDragOver={(e) => handleDragOver(e, 0)}
              onDrop={(e) => handleDrop(e, 0)}
            >
              Drag sentences here or click on them below
            </div>
          ) : (
            userOrder.map((id, index) => {
              const sentence = shuffledSentences.find(s => s.id === id);
              const isCorrect = isSubmitted && id === index;
              const isIncorrect = isSubmitted && id !== index;
              
              return (
                <div 
                  key={`ordered-${id}`}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isCorrect
                      ? 'bg-green-50 border-green-300'
                      : isIncorrect
                      ? 'bg-red-50 border-red-300'
                      : 'bg-white border-gray-300 hover:bg-gray-100'
                  }`}
                  draggable={!isSubmitted}
                  onDragStart={() => handleDragStart(id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => handleItemClick(id)}
                >
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 mr-2 text-sm font-medium bg-gray-200 rounded-full">
                      {index + 1}
                    </span>
                    <span>{sentence?.text}</span>
                    
                    {isSubmitted && (
                      <div className="ml-auto">
                        {isCorrect ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="ml-2 text-sm text-red-600">Should be position {id + 1}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Available sentences */}
      {userOrder.length < sentences.length && !isSubmitted && (
        <div className="mt-6">
          <h4 className="mb-3 font-medium text-gray-700">Available sentences:</h4>
          <div className="space-y-2">
            {shuffledSentences.map(sentence => {
              // Only show sentences that are not in the user order
              if (userOrder.includes(sentence.id)) return null;
              
              return (
                <div 
                  key={`available-${sentence.id}`}
                  className="p-3 transition-colors bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  draggable
                  onDragStart={() => handleDragStart(sentence.id)}
                  onClick={() => handleItemClick(sentence.id)}
                >
                  {sentence.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="flex space-x-4">
        {!isSubmitted ? (
          <>
            <Button 
              onClick={handleSubmit} 
              disabled={userOrder.length < sentences.length}
            >
              Check Order
            </Button>
            
            {userOrder.length > 0 && (
              <Button 
                variant="outline" 
                onClick={resetExercise}
              >
                Reset
              </Button>
            )}
          </>
        ) : (
          <div className="w-full p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-blue-800">
              {userOrder.every((id, index) => id === index)
                ? 'Great job! The sentences are in the correct order.'
                : 'The order is not correct. The correct positions are shown above.'}
            </p>
            
            {!userOrder.every((id, index) => id === index) && (
              <div className="mt-4">
                <h5 className="mb-2 font-medium text-blue-800">Correct order:</h5>
                <div className="space-y-2">
                  {sentences.map((text, index) => (
                    <div key={`correct-${index}`} className="p-2 bg-white border border-blue-200 rounded">
                      <span className="flex items-center justify-center w-6 h-6 mr-2 text-sm font-medium bg-blue-100 rounded-full">
                        {index + 1}
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReorderExercise;
