import React from 'react';
import {
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ISlot } from '../../entities/types/ISlot';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  calendarRows: (Date | null)[][];
  selectedSpaceId: string | null;
  findEventsForDate: (date: Date) => ISlot[];
  handleDeleteModalOpen: (event: ISlot) => void;
  handleAddEventModalOpen: (date: Date) => void;
  handleInfo: (id: number) => void;
  events: any[];
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
  calendarRows,
  selectedSpaceId,
  findEventsForDate,
  handleDeleteModalOpen,
  handleAddEventModalOpen,
  handleInfo,
  events,
}) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ids = events.map(event => event.slot.id);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {`${monthNames[currentMonth]} ${currentYear}`}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined" onClick={handlePrevMonth}>
          Previous
        </Button>
        <Button variant="outlined" onClick={handleNextMonth}>
          Next
        </Button>
      </Box>
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
                                color={
                                  ids.includes(event.id) ? 'warning' : 'info'
                                }
                                size="small"
                                sx={{
                                  textWrap: 'nowrap',
                                  width: '100px',
                                  alignSelf: 'center',
                                }}
                                onClick={() =>
                                  ids.includes(event.id)
                                    ? handleInfo(event.id)
                                    : handleDeleteModalOpen(event)
                                }
                              >
                                {ids.includes(event.id) ? 'Booked' : 'Free'}
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
                              onClick={() => handleAddEventModalOpen(day!!)}
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
    </>
  );
};

export default Calendar;
