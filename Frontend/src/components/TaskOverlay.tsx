import React from 'react';
import { ListItemText } from '@mui/material';
import StyledCard from "./StyledCard.tsx";
import ITask from "../interfaces/ITask.ts";

interface TaskOverlayProps {
    task: ITask;
}

const TaskOverlay: React.FC<TaskOverlayProps> = React.memo(({ task }) => {
    return (
        <StyledCard
            style={{
                padding: '10px',
                width: '100%',
                cursor: 'grabbing',
                opacity: 0.9,
            }}
            className={!task.isCompleted ? "tarefaContainer" : "tarefaContainer checked"}
        >
            <ListItemText
                primary={task.description}
                sx={{
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                }}
            />
        </StyledCard>
    );
});

export default TaskOverlay;