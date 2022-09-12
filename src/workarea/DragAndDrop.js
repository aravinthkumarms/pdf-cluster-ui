import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateData, updatePageOrder, updateFileName } from '../reducer/imageReducer';


function DragAndDrop() {
    const dispatch = useDispatch();
    const imageList = useSelector(state => state.image.imageList);
    const data = useSelector(state => state.image.data);
    const pageOrder = useSelector(state => state.image.pageOrder);
    const fileName = useSelector(state => state.image.fileName);

    console.log(imageList)
    React.useEffect(() => {
        let mounted = true;
        let object = {};
        const row = []
        const PageList = Object.keys(imageList)
        PageList.sort()
        const PageValList = Object.values(imageList)
        PageValList.sort()
        console.log(PageValList)
        for (let i = 0; i < PageList.length; i++) {
            object["id"] = i + 1
            object["page"] = imageList["Page_" + (i + 1)]
            row.push(object)
            object = {}
        }
        dispatch(updateData(row))
        console.log(mounted)
        return () => mounted = false;
    }, [imageList, dispatch])
    console.log(data)


    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const reorderedList = []
        for (let i = 0; i < items.length; i++) {
            reorderedList.push(items[i].id);
        }
        dispatch(updatePageOrder(reorderedList));
    }
    console.log(pageOrder)
    console.log(fileName)
    function saveOrder() {
        let body = { pageOrder: pageOrder }
        console.log(body)
        fetch("http://localhost:7000/createPDF/v2/" + fileName, {
            method: 'POST',
            headers: {
                accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response => console.log(response)))
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>Change Order</h1>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="data">
                        {(provided) => (
                            <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                {data.map(({ id, page }, index) => {
                                    return (
                                        <Draggable key={id} draggableId={page} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <div className="characters-thumb">
                                                        <img src={page} alt={id} />
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
            <Button variant="contained" onClick={() => saveOrder()}>Solid</Button>
        </div>
    );
}


export default DragAndDrop;

