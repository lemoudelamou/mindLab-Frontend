import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { saveEventData, getAllEvents, deleteEventById, updateEventById } from "../../Api/Api";
import { useAuth } from "../../utils/AuthContext";
import  "../../style/Calender.css"

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventDetails, setEventDetails] = useState({ title: "", note: "" });
    const { userId, user } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [sideItemDialogOpen, setSideItemDialogOpen] = useState(false);
    const [sideEvents, setSideEvents] = useState([]);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const generateRandomColor = () => {
        // Ensure clear colors by adjusting brightness
        const brightnessThreshold = 200;

        let red, green, blue;

        // Generate colors until a clear one is found
        do {
            red = Math.floor(Math.random() * 256);
            green = Math.floor(Math.random() * 256);
            blue = Math.floor(Math.random() * 256);
        } while ((red + green + blue) / 3 < brightnessThreshold);

        // Return the RGB color string
        return `rgb(${red},${green},${blue})`;
    };
    const handleDateClick = (selected) => {
        setSelectedDate(selected);
        setDialogOpen(true);
    };

    const fetchEvents = async () => {
        const fetchedEvents = await getAllEvents(userId);

        const formattedEvents = fetchedEvents.map((event) => ({
            id: event.id,
            title: event.title,
            note: event.note,
            date: event.start,
            backgroundColor: event.backgroundColor || generateRandomColor(),
        }));

        const formattedSideEvents = fetchedEvents.map((event) => ({
            id: event.id,
            title: event.title,
            note: event.note,
            start: event.start,
            end: event.end,
            date: event.start,
            allDay: event.allDay,
        }));
        setSideEvents(formattedSideEvents);
        setCurrentEvents(formattedEvents);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventClick = (selected) => {
        setSelectedEvent(selected.event);
        setDeleteDialogOpen(true);
    };

    const handleDeleteEvent = async () => {
        const eventId = selectedEvent.id;
        selectedEvent.remove();
        await deleteEventById(eventId);
        fetchEvents();
        setDeleteDialogOpen(false);
    };

    const handleUpdateEvent = async () => {
        setDeleteDialogOpen(false);
        setUpdateDialogOpen(true);
        setEventDetails({
            title: selectedEvent.title || "",
            note: selectedEvent.extendedProps?.note || "",
        });
    };

    const handleUpdate = async () => {
        await updateEventById(selectedEvent.id, {
            title: eventDetails.title,
            note: eventDetails.note,
        });
        setUpdateDialogOpen(false);
        fetchEvents();
    };

    const handleDialogClose = async () => {
        setDialogOpen(false);
        setSelectedDate(null);
        setEventDetails({ title: "", note: "" });
    };

    const handleAddEvent = async () => {
        if (eventDetails.title) {
            const eventData = {
                title: eventDetails.title,
                note: eventDetails.note,
                start: selectedDate.startStr,
                end: selectedDate.endStr,
                allDay: selectedDate.allDay,
                user: user,
                backgroundColor: generateRandomColor(),
            };
            await saveEventData(eventData);
            selectedDate.view.calendar.addEvent(eventData);
            handleDialogClose();
            fetchEvents();
        }
    };

    const handleSidebarItemClick = async (event) => {
        setSelectedEvent(event);
        setSideItemDialogOpen(true);
        setEventDetails({
            title: event.title,
            note: event.note,
            start: event.start,
            end: event.end,
        });
    };

    return (
        <div style={{ paddingTop: "100px" }}>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between">
                    <Box
                        flex="1 1 20%"
                        backgroundColor={colors.primary[400]}
                        p="15px"
                        borderRadius="4px"
                    >
                        <Typography variant="h5">Events</Typography>
                        <List>
                            {sideEvents.map((event) => (
                                <ListItem
                                    key={event.id}
                                    onClick={() => handleSidebarItemClick(event)}
                                    sx={{
                                        backgroundColor: "#2d3d50",
                                        color: "white",
                                        margin: "10px 0",
                                        borderRadius: "10px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <ListItemText primary={event.title} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box
                        flex="1 1 100%"
                        ml="15px"
                        sx={{
                            fontSize: "14pt",
                    }}
                    >
                        <FullCalendar
                            height="75vh"
                            weekends={false}
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                                listPlugin,
                            ]}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                            }}
                            initialView="dayGridMonth"
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            select={handleDateClick}
                            eventClick={handleEventClick}
                            events={currentEvents}
                            eventContent={(arg) => (
                                <>
                                    <b style={{ paddingLeft: "5px", color: "black" }}>{arg.timeText}</b>
                                    <i style={{ paddingLeft: "5px", color: "black" }}>{arg.event.title}</i>
                                </>
                            )}
                        />
                    </Box>
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>Add Event</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={eventDetails.title}
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                title: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Note"
                        value={eventDetails.note}
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                note: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${theme.palette.primary.light}` }}>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleAddEvent} color="primary">
                        Add Event
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle sx={{ backgroundColor: theme.palette.error.main, color: theme.palette.common.white, padding: "16px" }}>
                    Delete or Update Event
                </DialogTitle>
                <DialogContent sx={{ padding: "16px", minWidth: "400px", minHeight: "200px" }}>
                    <Typography style={{ marginTop: "80px" }}>
                        Are you sure you want to delete the event? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${theme.palette.error.light}`, padding: "16px", justifyContent: "space-between" }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Box>
                        <Button onClick={handleUpdateEvent} color="primary">
                            Update
                        </Button>
                        <Button onClick={handleDeleteEvent} color="error">
                            Delete
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>Update Event</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={eventDetails.title}
                        onChange={(e) => {
                            setEventDetails({
                                ...eventDetails,
                                title: e.target.value,
                            });
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Note"
                        value={eventDetails.note}
                        onChange={(e) => {
                            setEventDetails({
                                ...eventDetails,
                                note: e.target.value,
                            });
                        }}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${theme.palette.primary.light}` }}>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={sideItemDialogOpen} onClose={() => setSideItemDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>
                    Event Details
                </DialogTitle>
                <DialogContent sx={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ marginBottom: "10px", marginTop: "20px" }}>
                        Event Title: {eventDetails.title}
                    </Typography>
                    <Typography sx={{ marginBottom: "8px" }}>
                        <strong>Note:</strong> {eventDetails.note}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ marginBottom: "8px" }}>
                        <strong>Date:</strong> {new Date(eventDetails.start).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                    </Typography>
                    {selectedEvent && selectedEvent.allDay ? (
                        <>
                            {/* Content for all-day events */}
                        </>
                    ) : (
                        <>
                            <Typography sx={{ marginBottom: "8px" }}>
                                <strong>Start Time:</strong> {new Date(eventDetails.start).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                            </Typography>
                            <Typography sx={{ marginBottom: "8px" }}>
                                <strong>End Time:</strong> {new Date(eventDetails.end).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${theme.palette.error.light}`, padding: "16px", justifyContent: "flex-end" }}>
                    <Button onClick={() => setSideItemDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Calendar;
