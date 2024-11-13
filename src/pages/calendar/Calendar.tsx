import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useUserStore } from '../../app/store/useUserStore';
import { ISpace } from '../../entities/types/ISpace';
import useFetch from '../../shared/network/useFetch';
import { ISlot } from '../../entities/types/ISlot';

type Week = (Date | null)[];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarPage() {
  const { user } = useUserStore();
  const [data, setData] = useState<ISpace[]>([]);
  const [events, setEvents] = useState<ISlot[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const { fetchData: fetchSpaces } = useFetch<ISpace[]>(
    'https://space-event.kenuki.org/order-service/api/v1/space',
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const daysInMonth: (Date | null)[] = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentYear, currentMonth, i));
  }

  const emptyCells: null[] = [];
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    emptyCells.push(null);
  }

  const calendarRows: Week[] = [];
  const cells = [...emptyCells, ...daysInMonth];

  cells.forEach((day, i) => {
    if (i % 7 === 0) {
      calendarRows.push(cells.slice(i, i + 7) as Week);
    }
  });

  const findEventsForDate = (date: Date | null): ISlot[] => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.startTime).toDateString();
      return eventDate === dateStr;
    });
  };

  const handleSpaceChange = (event: SelectChangeEvent) => {
    setSelectedSpaceId(event.target.value as string);
  };

  const updateSlots = useCallback(() => {
    if (selectedSpaceId) {
      fetch(
        `https://space-event.kenuki.org/order-service/api/v1/slots/${selectedSpaceId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(data => setEvents(data));
    }
  }, [selectedSpaceId, user]);

  const handleAddEvent = useCallback(
    (day: Date) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 1);
      const startTime = `${dayStart.getFullYear()}-${String(dayStart.getMonth() + 1).padStart(2, '0')}-${String(dayStart.getDate()).padStart(2, '0')}T00:00:00.00`;

      const dayFinish = new Date(day);
      dayFinish.setHours(23, 59, 59, 999);
      const endTime = `${dayFinish.getFullYear()}-${String(dayFinish.getMonth() + 1).padStart(2, '0')}-${String(dayFinish.getDate()).padStart(2, '0')}T23:59:59.99`;

      const url = `https://space-event.kenuki.org/order-service/api/v1/slots/${selectedSpaceId}?startTime=${startTime}&endTime=${endTime}`;

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.ok) {
          updateSlots();
        }
      });
    },
    [selectedSpaceId, user, updateSlots],
  );

  const deleteSlot = (id: number) => {
    const url = `https://space-event.kenuki.org/order-service/api/v1/slots/${id}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        updateSlots(); // Refresh events after deleting a slot
      }
    });
  };

  useEffect(() => {
    fetchSpaces({
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response) {
        setData(response);
      }
    });
  }, [fetchSpaces, user]);

  useEffect(() => {
    updateSlots(); // Initial fetch of slots when selectedSpaceId changes
  }, [selectedSpaceId, updateSlots]);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Calendar
      </Typography>
      <FormControl sx={{ mb: 2, width: '300px' }}>
        <InputLabel id="space-select-label">Select Space</InputLabel>
        <Select
          labelId="space-select-label"
          value={selectedSpaceId || ''}
          label="Select Space"
          onChange={handleSpaceChange}
        >
          {data.map(space => (
            <MenuItem key={space.id} value={space.id}>
              {space.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {daysOfWeek.map(day => (
                <TableCell key={day} align="center">
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {calendarRows.map((week, index) => (
              <TableRow key={index}>
                {week.map((day, idx) => (
                  <TableCell key={idx} align="left">
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {selectedSpaceId && day ? (
                        <>
                          {day.getDate()}
                          {findEventsForDate(day).length > 0 ? (
                            findEventsForDate(day).map(event => (
                              <Button
                                key={event.id}
                                variant="contained"
                                color={event.booked ? 'warning' : 'info'}
                                size="small"
                                sx={{
                                  textWrap: 'nowrap',
                                  width: '100px',
                                  alignSelf: 'center',
                                }}
                                onClick={() => deleteSlot(event.id)}
                              >
                                {event.booked ? 'Booked' : 'Free'}
                              </Button>
                            ))
                          ) : (
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{
                                textWrap: 'nowrap',
                                width: '100px',
                                alignSelf: 'center',
                              }}
                              onClick={() => handleAddEvent(day!!)}
                            >
                              +
                            </Button>
                          )}
                        </>
                      ) : (
                        ''
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CalendarPage;
