import React, { useEffect, useState } from 'react';
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
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
    'https://zenuki.kz/api/v1/space',
  );

  const { fetchData: fetchSlot } = useFetch<ISlot[]>(
    `https://zenuki.kz/api/v1/slots/${selectedSpaceId}`,
  );

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
  }, []);

  useEffect(() => {
    if (selectedSpaceId) {
      fetchSlot({
        headers: {
          Authorization: `Bearer ${user?.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log(response);
        if (response) {
          setEvents(response);
        }
      });
    }
  }, [selectedSpaceId]);

  const handleSpaceChange = (event: SelectChangeEvent) => {
    setSelectedSpaceId(event.target.value as string);
  };

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
                    {day ? day.getDate() : ''}
                    {findEventsForDate(day).map(event => (
                      <Chip
                        key={event.id}
                        label={event.booked ? 'Booked' : 'free'}
                        color="primary"
                        sx={{ padding: '0', margin: '0' }}
                      />
                    ))}
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
