import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';


const finalSpaceCharacters = [

  {
    id: 'Page_1',
    thumb: 'https://storage.cloud.google.com/pdf-split-files/TestDoc1/thumbanails/Page_1.webp?authuser=4'
  },
  {
    id: 'Page_2',
    thumb: 'https://storage.cloud.google.com/pdf-split-files/TestDoc1/thumbanails/Page_2.webp?authuser=4'
  },
  {
    id: 'Page_3',
    thumb: 'https://storage.cloud.google.com/pdf-split-files/TestDoc1/thumbanails/Page_3.webp?authuser=4'
  }
]

function App() {
  const [characters, updateCharacters] = useState(finalSpaceCharacters);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TestDoc1</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {characters.map(({ id, thumb }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="characters-thumb">
                            <img src={thumb} alt={`Thumb`} />
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
      <p>
        Images from <a href="https://final-space.fandom.com/wiki/Final_Space_Wiki">Final Space Wiki</a>
      </p>
    </div>
  );
}

export default App;
