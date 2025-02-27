import {Box, List, ListItem, Typography} from "@mui/material";
import StyledCard from "./StyledCard.tsx";
import React from "react";
import ITask from "../interfaces/ITask.ts";
import {FuseResult} from "fuse.js";
import {ArrowForward, SearchOff} from "@mui/icons-material";

interface ISearchTasksProps {
    open: boolean;
    filteredTasks: FuseResult<ITask>[];
    handleClick: (index: number) => void;
}

const SearchTasks: React.FC<ISearchTasksProps> = ({
                                                      open,
                                                      filteredTasks,
                                                      handleClick,
                                                  }: ISearchTasksProps) => {
    return (
        <>
            {open &&
                <StyledCard className={"containerPesquisar"}>
                    <List id={"searchList"}>
                        {filteredTasks.map((task: FuseResult<ITask>) => (
                            <ListItem key={task.item.id} id={"searchListItem"} onMouseDown={() => {
                                if (task.item.order) {
                                    handleClick(task.item.order - 1)
                                }
                            }}>
                                <Typography sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "250px"
                                }}>{task.item.description}</Typography>

                                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                    <Typography>{task.item.isCompleted ? "COMPLETADO" : "PENDENTE"}</Typography>
                                    <ArrowForward/>
                                </Box>
                            </ListItem>

                        ))}
                    </List>

                    {filteredTasks.length === 0 &&
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                            <SearchOff />
                            <Typography>- Nenhum resultado encontrado -</Typography>
                        </Box>
                    }
                </StyledCard>
            }
        </>
    )
}

export default SearchTasks