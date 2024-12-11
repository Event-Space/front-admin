import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Input,
} from '@mui/material';
import { ISlot } from '../../entities/types/ISlot';
import { ISpace } from '../../entities/types/ISpace';

interface DetailsInfo {
  id: number;
  slot: ISlot;
  space: ISpace;
  userEmail: string;
  bookingTime: string;
  status: string;
}

interface InfoModalProps {
  openInfoModal: boolean;
  info: DetailsInfo | null;
  handleInfoModalClose: () => void;
  handleStatusChange: (newStatus: string) => void;
}

const InfoModal: React.FC<InfoModalProps> = ({
  openInfoModal,
  handleInfoModalClose,
  info,
  handleStatusChange,
}) => {
  const [status, setStatus] = useState<string>(info?.status || 'PENDING');
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (info) {
      setStatus(info?.status);
    }
  }, [info]);

  const handleStatusSelectChange = (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value;
    if (info?.status === newStatus) {
      setChanged(false);
    } else {
      setChanged(true);
    }
    setStatus(newStatus);
  };

  const handleSave = () => {
    handleStatusChange(status);
    handleInfoModalClose();
  };

  return (
    <Dialog open={openInfoModal} onClose={handleInfoModalClose}>
      <DialogTitle>
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '36px',
          }}
        >
          Details of booking
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            textAlign: 'right',
            color:
              status === 'CONFIRMED'
                ? 'green'
                : status === 'CANCELLED'
                  ? 'red'
                  : 'orange',
          }}
        >
          {status}
        </Typography>
        <Typography>Space Name: {info?.space.name}</Typography>
        <Typography>Booked By: {info?.userEmail}</Typography>
        <Typography>
          Booked time:{' '}
          {info?.bookingTime ? new Date(info.bookingTime).toDateString() : ''}
        </Typography>
        <Typography>Price: {info?.space.baseRentalCost}</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={handleStatusSelectChange}
            label="Status"
          >
            <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </Select>
          {changed && status !== 'CONFIRMED' && status !== info?.status && (
            <Input placeholder="reason" />
          )}
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={handleInfoModalClose} color="primary">
          Close
        </Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
