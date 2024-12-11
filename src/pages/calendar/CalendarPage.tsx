import { useCallback, useEffect, useState } from 'react';
import {
  Box,
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
import DeleteModal from './DeleteModal';
import AddModal from './AddModal';
import Calendar from './Calendar';
import InfoModal from './InfoModal';

type Week = (Date | null)[];

interface DetailsInfo {
  id: number;
  slot: ISlot;
  space: ISpace;
  userEmail: string;
  bookingTime: string;
  status: string;
}

function CalendarPage() {
  const { user } = useUserStore();
  const [data, setData] = useState<ISpace[]>([]);
  const [events, setEvents] = useState<ISlot[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>('2');
  const { fetchData: fetchSpaces } = useFetch<ISpace[]>(
    'https://space-event.kenuki.org/order-service/api/v1/space',
  );

  const { fetchData: fetchSpaceBookedSlots } = useFetch<DetailsInfo[]>(
    `https://space-event.kenuki.org/order-service/api/v1/slots/bookings/${selectedSpaceId}`,
  );

  const [slotsInfo, setSlotsInfo] = useState<DetailsInfo[]>([]);

  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );

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

      fetchSpaceBookedSlots({
        headers: {
          Authorization: `Bearer ${user?.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response) {
          setSlotsInfo(response);
        }
      });
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
        updateSlots();
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
  }, [user]);

  useEffect(() => {
    updateSlots();
  }, [selectedSpaceId, updateSlots]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<ISlot | null>(null);

  const handleDeleteModalOpen = (event: ISlot) => {
    setEventToDelete(event);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setEventToDelete(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteSlot(eventToDelete.id);
      handleDeleteModalClose();
    }
  };

  const [openAddEventModal, setOpenAddEventModal] = useState<boolean>(false);
  const [dt, setDt] = useState<DetailsInfo | null>(null);
  const [dayToAddEvent, setDayToAddEvent] = useState<Date | null>(null);
  const [openDetailedModal, setDetailedModal] = useState<boolean>(false);

  const handleCloseDetailModal = () => {
    setDetailedModal(false);
    setDt(null);
  };

  const handleAddEventModalOpen = (day: Date) => {
    setDayToAddEvent(day);
    setOpenAddEventModal(true);
  };

  const handleAddEventModalClose = () => {
    setDayToAddEvent(null);
    setOpenAddEventModal(false);
  };

  const handleAddEventConfirm = () => {
    if (dayToAddEvent) {
      handleAddEvent(dayToAddEvent);
      handleAddEventModalClose();
    }
  };

  const handleInfo = (slotId: number) => {
    setDetailedModal(true);
    const booking = slotsInfo.find(
      entry => entry.slot.id === slotId && entry.slot.booked === true,
    );
    if (booking) {
      setDt(booking);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const url = `https://space-event.kenuki.org/order-service/api/v1/slots/bookings/${dt?.id}/status?status=${newStatus}`;

    fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        updateSlots();
      }
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
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
      {selectedSpaceId && (
        <Calendar
          handleInfo={handleInfo}
          currentMonth={currentMonth}
          currentYear={currentYear}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          calendarRows={calendarRows}
          events={slotsInfo}
          selectedSpaceId={selectedSpaceId}
          findEventsForDate={findEventsForDate}
          handleDeleteModalOpen={handleDeleteModalOpen}
          handleAddEventModalOpen={handleAddEventModalOpen}
        />
      )}

      <InfoModal
        openInfoModal={openDetailedModal}
        info={dt}
        handleInfoModalClose={handleCloseDetailModal}
        handleStatusChange={handleStatusChange}
      />

      <AddModal
        openAddEventModal={openAddEventModal}
        handleAddEventModalClose={handleAddEventModalClose}
        handleAddEventConfirm={handleAddEventConfirm}
      />

      <DeleteModal
        openDeleteModal={openDeleteModal}
        handleDeleteModalClose={handleDeleteModalClose}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

export default CalendarPage;
