import React, {MutableRefObject} from "react";
import {
    Box,
    Checkbox,
    IconButton, InputAdornment,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Check, Close, Delete, DragIndicator, Edit, EditNote, MoreVert} from "@mui/icons-material";
import ITask from "../interfaces/ITask.ts";
import StyledCard from "./StyledCard.tsx";
import styles from "../styles/Tarefa.module.css";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ModalViewEnum from "../enums/ModalViewEnum.ts";
import formattedDate from "../utils/formattedDate.ts";

interface ITaskProps {
    tasks: ITask;
    renamedTask?: ITask | null;
    onChangeStatus: (taskId: number) => void;
    onRename: (taskId: number, description: string) => void;
    onRenameConfirm: () => void;
    onRenameCancel: () => void;
    handleDelete: (taskId: number) => void;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    tasksRef: MutableRefObject<(HTMLDivElement | null)[]>;
    handleMobileModalView: (view: ModalViewEnum, task?: ITask) => void;
}

const Task: React.FC<ITaskProps> = ({
                                        tasks,
                                        renamedTask,
                                        onChangeStatus,
                                        onRename,
                                        onRenameConfirm,
                                        onRenameCancel,
                                        handleDelete,
                                        tasksRef,
                                        handleMobileModalView,
                                    }: ITaskProps) => {
    const labelId = `checkbox-label-${tasks.id}`;

    const id = tasks.id;
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const style = {
        willChange: "transform",
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const getTaskDate: { date: string, time: string } = formattedDate(tasks.creationDate as Date);

    return (
        <ListItem ref={setNodeRef} style={style}
                  disableGutters {...(!isDesktop ? attributes : {})} {...(!isDesktop ? listeners : {})}>
            <StyledCard
                className={`tarefaContainer ${tasks.isCompleted ? "checked" : ""} ${isDragging ? "isDragging" : ""}`}
                ref={(el) => {
                    if (tasks.order) {
                        tasksRef.current[tasks.order - 1] = el
                    }
                }}>
                <ListItemIcon>
                    <Tooltip title={!tasks.isCompleted ? "Marcar tarefa" : "Desmarcar tarefa"}>
                        <Checkbox
                            className={"tarefaCheck"}
                            edge="start"
                            onChange={() => onChangeStatus(tasks.id)}
                            checked={tasks.isCompleted}
                            inputProps={{'aria-labelledby': labelId}}
                            aria-label={tasks.isCompleted ? "Desmarcar tarefa" : "Marcar tarefa"}
                            size={"large"}
                        />
                    </Tooltip>
                </ListItemIcon>

                {isDesktop && renamedTask?.id === tasks.id
                    ? <TextField
                        onChange={e => onRename(renamedTask.id, e.currentTarget.value)}
                        defaultValue={tasks.description} fullWidth size={"small"}
                        sx={{paddingX: "5px"}}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EditNote/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    :
                    <>
                        <ListItemText id={labelId} primary={tasks.description}
                                      sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginX: "10px",
                                          wordBreak: "break-word",
                                          whiteSpace: "normal",
                                          textDecorationLine: tasks.isCompleted ? "line-through" : "none",
                                      }}
                        />

                        {tasks.creationDate && isDesktop &&
                            <Typography color={"grey"}>{`${getTaskDate.date} às ${getTaskDate.time}`}</Typography>
                        }
                    </>
                }


                {isDesktop &&
                    <div style={{display: "flex", gap: "5px"}}>
                        {renamedTask?.id === tasks.id
                            ? <>
                                <Tooltip title={"Cancelar alteração"}>
                                    <IconButton onClick={() => onRenameCancel()}
                                                aria-label={"Cancelar alteração"}
                                    >
                                        <Close color={"primary"}/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={"Confirmar alteração"}>
                                    <IconButton onClick={() => onRenameConfirm()}
                                                aria-label={"Confirmar alteração"}
                                                className={"btConfirmar"}
                                    >
                                        <Check color={"primary"}/>
                                    </IconButton>
                                </Tooltip>
                            </>

                            : <>
                                <Tooltip title={"Editar tarefa"}>
                                    <IconButton
                                        aria-label={"Editar tarefa"}
                                        onClick={() => onRename(tasks.id, tasks.description)}>
                                        <Edit color={"primary"}/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={"Remover tarefa"}>
                                    <IconButton aria-label={"Remover tarefa"}
                                                onClick={() => handleDelete(tasks.id)}>
                                        <Delete color={"error"}/>
                                    </IconButton>
                                </Tooltip>
                            </>
                        }

                        <div className={styles.draggableArea} {...attributes} {...listeners}>
                            <DragIndicator/>
                        </div>
                    </div>
                }

                {!isDesktop &&
                    <Box>
                        <IconButton onClick={() => {
                            handleMobileModalView(ModalViewEnum.TaskActions, tasks)
                        }} className={"btMobileOptions"} disableRipple>
                            <MoreVert className={"isMobile"}/>
                        </IconButton>
                    </Box>
                }

            </StyledCard>
        </ListItem>
    )
}

export default Task;