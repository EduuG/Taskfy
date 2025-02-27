import React, {useCallback, useEffect, useRef, useState} from "react";
import api from "../api/api.ts";
import {
    AlertColor, Box,
    Button,
    Divider, Fade, FormControl, InputAdornment,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Modal, Skeleton, Switch,
    TextField, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {Add, CloseSharp, Delete, Edit, EditNote, Logout, Search, Settings} from "@mui/icons-material";
import ITask from "../interfaces/ITask.ts";
import StyledCard from "../components/StyledCard.tsx";
import Task from "../components/Task.tsx";
import {
    closestCorners,
    DndContext,
    DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {
    restrictToFirstScrollableAncestor,
    restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import SearchTasks from "../components/SearchTasks.tsx";
import Fuse, {FuseResult} from "fuse.js";
import {DebounceInput} from "react-debounce-input";
import InfoSidebar from "../components/InfoSidebar.tsx";
import IconButton from "@mui/material/IconButton";
import ModalViewEnum from "../enums/ModalViewEnum.ts";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import {useColorScheme} from "@mui/material/styles";
import formattedDate from "../utils/formattedDate.ts";
import {useUser} from "../contexts/UserContext.tsx";
import {AxiosResponse} from "axios";

interface ITaskListProps {
    showFeedback: (message: string, severity: AlertColor) => void;
    showDialog: (title: string, message: string, action: () => void) => void;
    handleLogout: () => void;
}

const TaskList: React.FC<ITaskListProps> = ({showFeedback, showDialog, handleLogout}: ITaskListProps) => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [renamedTask, setRenamedTask] = useState<ITask | null>();
    const [filteredTasks, setFilteredTasks] = useState<FuseResult<ITask>[]>([]);

    const [loading, setLoading] = useState(true);
    const listRef = useRef<HTMLUListElement | null>(null);
    const tasksRef = useRef<(HTMLDivElement | null)[]>([]);

    // Variáveis referentes a pesquisa de tarefas
    const [searchText, setSearchText] = useState<string>("");
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const fuseRef = useRef(new Fuse(tasks, {keys: ["description"], useExtendedSearch: true, threshold: 0.3}));

    // Variáveis para mobile
    const [mobileModalOpen, setMobileModalOpen] = useState<boolean>(false);
    const [mobileModalView, setMobileModalView] = useState<number>(0);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const pendingTasksCount = tasks.filter(t => !t.isCompleted).length;

    const {isTryingOut} = useUser();

    const {mode, setMode} = useColorScheme();

    useEffect(() => {
        const fetchTasks = async () => {
            if (isTryingOut) {
                setTasks([]);
                setLoading(false);
                return;
            }

            try {
                const response = await api.get<ITask[]>("/Task/List");

                setTasks(response.data);
            } catch {
                showFeedback("Ocorreu um erro ao buscar as tarefas. Tente novamente mais tarde.", "error");
            } finally {
                setLoading(false)
            }
        }

        fetchTasks();
    }, [showFeedback]);

    useEffect(() => {
        if (isDesktop) {
            setMobileModalOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => {
        if (searchText !== "") {
            setSearchOpen(true);
        } else {
            setSearchOpen(false);
            setFilteredTasks([]);
        }
    }, [searchText]);

    useEffect(() => {
        fuseRef.current = new Fuse(tasks, {keys: ["description"], useExtendedSearch: true, threshold: 0.3});
    }, [tasks]);


    const onInsert = useCallback(async () => {
        if (!taskDescription.trim()) return;

        if (tasks.find(x => x.description.trim() === taskDescription.trim())) {
            showFeedback("Essa tarefa já existe!", "warning");
            return;
        }

        try {
            let response: AxiosResponse<ITask> | ITask;

            if (isTryingOut) {
                response = {
                    id: tasks.length + 1,
                    description: taskDescription.trim(),
                    active: 1,
                    order: tasks.length + 1,
                    isCompleted: false,
                    creationDate: new Date(),
                };
            } else {
                response = await api.post<ITask>("/Task/Insert", {
                    Description: taskDescription.trim(),
                }, {
                    headers: {
                        Accept: "application/json",
                    },
                });
            }

            setTasks(prevTasks => [
                ...prevTasks, 'data' in response ? response.data : response
            ]);

            setTimeout(() => {
                if (listRef.current) {
                    listRef.current.scrollTo({top: listRef.current.scrollHeight, behavior: "smooth"});
                }
            }, 0);

            showFeedback("Tarefa adicionada com sucesso.", "success");
        } catch {
            showFeedback("Ocorreu um erro ao inserir a tarefa.", "error");
        }

        setTaskDescription("");
    }, [taskDescription, tasks, showFeedback])

    const onDelete = useCallback(async (id: number) => {
        try {
            if (!isTryingOut) {
                await api.delete<ITask[]>(`/Task/Delete/${id}`);
            }

            setTasks(prevTarefas => prevTarefas.filter(x => x.id !== id));
            showFeedback("Tarefa removida com sucesso.", "success");
        } catch {
            showFeedback("Ocorreu um erro ao remover a tarefa.", "error");
        }
    }, [setTasks, showFeedback]);

    const handleDelete = useCallback((id: number) => {
        showDialog("Confirmar exclusão", "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.", () => onDelete(id));
    }, [showDialog, onDelete]);

    const onRename = useCallback((id: number, newDescription: string) => {
        setRenamedTask({id: id, description: newDescription});
    }, [setRenamedTask]);

    const onRenameConfirm = useCallback(
        async () => {
            const tarefasAlterada = [...tasks] as ITask[];
            const tarefaExistente = tarefasAlterada.find(x => x.id === renamedTask?.id) as ITask;

            if (renamedTask && renamedTask.description.trim() !== tarefaExistente.description.trim() && renamedTask.description !== "") {
                if (tasks.find(x => x.description.toLowerCase() === renamedTask.description.toLowerCase())) {
                    showFeedback("Essa tarefa já existe!", "warning");
                    return;
                }

                try {
                    if (!isTryingOut) {
                        await api.patch(`/Task/Rename/${renamedTask.id}`, {
                            Description: renamedTask.description,
                        });
                    }

                    if (tarefaExistente) {
                        tarefaExistente.description = renamedTask.description;
                    }

                    setTasks(tarefasAlterada);
                    showFeedback("Tarefa renomeada com sucesso.", "success");
                } catch {
                    showFeedback("Ocorreu um erro ao renomear a tarefa.", "error");
                }
            }

            setRenamedTask(null);
        }, [showFeedback, tasks, renamedTask])

    const onRenameCancel = useCallback(() => {
        setRenamedTask(null);
    }, [setRenamedTask]);

    const onChangeStatus = useCallback(async (id: number) => {
        try {
            if (!isTryingOut) {
                await api.patch<ITask[]>(`/Task/ChangeStatus/${id}`);
            }

            setTasks((prev) => prev.map((t) => t.id === id ? {...t, isCompleted: !t.isCompleted} : t));
        } catch {
            showFeedback("Ocorreu um erro ao alterar status da tarefa.", "error");
        }
    }, [setTasks, showFeedback]);

    const getTaskIndex = useCallback((id: UniqueIdentifier) => {
        return tasks.findIndex((x) => x.id === id);
    }, [tasks]);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) return;

        const originalIndex: number = getTaskIndex(active.id);
        const newIndex: number = getTaskIndex(over.id);
        const newOrder: ITask[] = arrayMove(tasks, originalIndex, newIndex);

        setTasks(newOrder);

        if (isTryingOut) return;

        try {
            await api.put(`/Task/Reorder`, newOrder);

        } catch {
            showFeedback("Ocorreu um erro ao reordenar a tarefa.", "error");
            setTasks(prev => arrayMove(prev, newIndex, originalIndex));
        }
    }, [getTaskIndex, tasks, setTasks, showFeedback]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleClickSearchField = () => {
        if (searchText !== "") {
            setSearchOpen(true);
            const result: FuseResult<ITask>[] = fuseRef.current.search(searchText);
            setFilteredTasks(result);
        }
    }

    const handleStartSearch = useCallback((text: string) => {
        setSearchText(text);
        const result: FuseResult<ITask>[] = fuseRef.current.search(text);
        setFilteredTasks(result);
    }, [setSearchText, setFilteredTasks]);

    const handleCloseSearch = useCallback(() => {
        setSearchOpen(false);
    }, [setSearchOpen]);

    const handleSearchTaskClick = useCallback((index: number) => {
        const focusedTask = tasksRef.current[index];

        focusedTask?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });

        focusedTask?.classList.add("focusedTask");

        setTimeout(() => {
            focusedTask?.classList.remove("focusedTask");
        }, 3000);

        setSearchOpen(false);
        setFilteredTasks([]);
    }, []);

    const handleMobileModalView = (view: ModalViewEnum, task?: ITask) => {
        if (task) {
            setSelectedTask(task);
        }

        setMobileModalView(view);
        setMobileModalOpen(true);
    }

    const handleMobileModalClose = () => {
        setMobileModalOpen(false);

        if (selectedTask !== null) {
            setSelectedTask(null);
        }
    }

    const handleModalItemClick = (action: () => void, closeAfterAction?: boolean) => {
        return () => {
            action();

            if (closeAfterAction) {
                handleMobileModalClose();
            }
        }
    }

    const handleDarkMode = () => {
        if (!mode || mode === "light" || mode === "system") {
            setMode("dark");
        } else {
            setMode("light");
        }
    }

    return (
        <Grid container spacing={2} flexGrow={1} maxHeight={"100%"}>
            {isDesktop &&
                <Grid container spacing={2} size={{xs: 12, md: 4}}
                      sx={{display: {sm: 'none', md: 'flex'}, flexDirection: "column", maxHeight: "100%"}}>
                    <InfoSidebar/>
                </Grid>
            }

            <Grid size={"grow"} maxHeight={"100%"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <StyledCard className={"listaContainer"} id={"cardAdicionar"} variant={"elevation"}
                            sx={{alignSelf: "start", maxHeight: "60px"}}>
                    <Grid container spacing={2} sx={{px: 2, width: "100%"}}>
                        <Grid size={9}>
                            <DebounceInput element={TextField} value={taskDescription} placeholder={"Nova tarefa..."}
                                           fullWidth
                                           onChange={(e) => setTaskDescription(e.target.value)}
                                           onKeyDown={(e) => e.key === "Enter" && onInsert()}
                                           size={"small"}
                            />
                        </Grid>

                        <Grid size="grow">
                            <Button onClick={onInsert} variant={"contained"} fullWidth
                                    aria-label={"Inserir nova tarefa"}
                                    sx={{minHeight: "100%"}}
                                    size={"small"}
                            >
                                <Add/> {isDesktop && "Adicionar"}
                            </Button>
                        </Grid>
                    </Grid>
                </StyledCard>

                <StyledCard className={"listaContainer"} id={"cardLista"} variant={"outlined"}
                            sx={{justifyContent: "space-between"}}>
                    {loading &&
                        [...Array(10)].map((_, index) => (
                            <Skeleton key={index} variant={"rectangular"} animation={"wave"}
                                      sx={{borderRadius: "10px", minHeight: "55px"}}/>
                        ))
                    }

                    {!loading &&
                        <StyledCard id={"listaHeader"}>
                            <Box gap={0}
                                 sx={{display: "flex", alignItems: "center", height: "100%", justifyContent: "center"}}>
                                <DebounceInput element={TextField} value={searchText} size={"small"}
                                               sx={{maxWidth: "300px"}}
                                               placeholder={"Pesquisar por tarefas"}
                                               slotProps={{
                                                   input: {
                                                       startAdornment: (
                                                           <InputAdornment position="start">
                                                               <Search/>
                                                           </InputAdornment>
                                                       ),
                                                       endAdornment: (
                                                           <InputAdornment position="end">
                                                               {searchText !== "" &&
                                                                   <CloseSharp sx={{cursor: "pointer"}}
                                                                               onClick={() => setSearchText("")}/>
                                                               }
                                                           </InputAdornment>
                                                       )
                                                   },
                                               }}
                                               onChange={e => handleStartSearch(e.target.value)}
                                               onClick={handleClickSearchField}
                                               onBlur={handleCloseSearch}
                                />
                            </Box>
                        </StyledCard>
                    }

                    <SearchTasks open={searchOpen} filteredTasks={filteredTasks} handleClick={handleSearchTaskClick}/>

                    {!loading && tasks.length <= 0 &&
                        <Box padding={3}>
                            <Typography variant={"subtitle1"} color={"text.secondary"}>- Adicione uma nova tarefa
                                -</Typography>
                        </Box>
                    }

                    <React.Fragment>
                        {!loading && tasks.length > 0 &&
                            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}
                                        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
                                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                                    <List ref={listRef}
                                          sx={{width: '100%', overflowY: 'auto', padding: "20px", height: "100%"}}>
                                        {tasks.map((task: ITask, index: number) => (
                                            <React.Fragment key={task.id}>
                                                <Task tasks={task}
                                                      renamedTask={renamedTask}
                                                      onRename={onRename}
                                                      onChangeStatus={onChangeStatus}
                                                      onRenameConfirm={onRenameConfirm}
                                                      onRenameCancel={onRenameCancel}
                                                      handleDelete={handleDelete}
                                                      tasksRef={tasksRef}
                                                      handleMobileModalView={handleMobileModalView}
                                                />

                                                {index < tasks.length - 1 &&
                                                    <Divider variant="fullWidth" component="li"/>
                                                }
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </SortableContext>
                            </DndContext>
                        }

                        <StyledCard id={"listaFooter"}>
                            <Box>
                                <Typography>
                                    {pendingTasksCount > 1 ? `${pendingTasksCount} Tarefas pendentes` : pendingTasksCount === 0 ? "Nenhuma tarefa pendente!" : `${pendingTasksCount} Tarefa pendente`}
                                </Typography>
                            </Box>

                            {!isDesktop &&
                                <Box>
                                    <IconButton onClick={() => handleMobileModalView(ModalViewEnum.Settings)}>
                                        <Settings/>
                                    </IconButton>
                                </Box>
                            }
                        </StyledCard>
                    </React.Fragment>
                </StyledCard>
            </Grid>

            <Modal open={mobileModalOpen} onClose={handleMobileModalClose} closeAfterTransition>
                <Fade in={mobileModalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            borderRadius: 1,
                            width: '80%',
                        }}
                    >
                        {mobileModalView === ModalViewEnum.Settings && (
                            <List sx={{width: "100%"}}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <DarkModeIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={"Tema escuro"}/>
                                        <Switch
                                            edge="end"
                                            onChange={handleDarkMode}
                                            checked={mode === "dark"}
                                            inputProps={{
                                                'aria-labelledby': 'switch-list-label-wifi',
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleModalItemClick(handleLogout, true)}>
                                        <ListItemIcon>
                                            <Logout/>
                                        </ListItemIcon>
                                        <ListItemText primary={"Sair"}/>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        )}

                        {mobileModalView === ModalViewEnum.TaskActions && selectedTask !== null && (
                            <List sx={{width: "100%"}} subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {(() => {
                                        const getTaskDate = formattedDate(selectedTask.creationDate as Date)
                                        return (
                                            <Box display={"flex"} flexDirection={"column"} gap={1}>
                                                <Typography>Descrição: {selectedTask.description}</Typography>

                                                <Typography>
                                                    Data de criação: {getTaskDate.date} às {getTaskDate.time}
                                                </Typography>

                                                <Divider/>
                                            </Box>
                                        )
                                    })()}
                                </ListSubheader>
                            }>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={handleModalItemClick(() => setMobileModalView(ModalViewEnum.Rename))}>
                                        <ListItemIcon>
                                            <Edit/>
                                        </ListItemIcon>
                                        <ListItemText primary={"Renomear"}/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={handleModalItemClick(() => handleDelete(selectedTask.id), true)}>
                                        <ListItemIcon>
                                            <Delete/>
                                        </ListItemIcon>
                                        <ListItemText primary={"Deletar"}/>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        )}

                        {mobileModalView === ModalViewEnum.Rename && selectedTask !== null && (
                            <StyledCard sx={{gap: 4}}>
                                <Box display={"flex"} flexDirection={"row"} gap={1}>
                                    <EditNote/>
                                    <Typography variant="h6">Renomear Tarefa</Typography>
                                </Box>

                                <FormControl>
                                    <DebounceInput
                                        element={TextField}
                                        label={"Novo nome"}
                                        value={selectedTask.description}
                                        onChange={(e) => onRename(selectedTask?.id, e.target.value)}
                                        fullWidth
                                    />
                                </FormControl>

                                <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-between'}}>
                                    <Button
                                        onClick={() => setMobileModalOpen(false)}
                                        variant="outlined"
                                        size={"large"}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            await onRenameConfirm();
                                            handleMobileModalClose()
                                        }}
                                        variant="contained"
                                        size={"large"}
                                    >
                                        Salvar
                                    </Button>
                                </Box>
                            </StyledCard>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Grid>
    );
};

export default TaskList;
