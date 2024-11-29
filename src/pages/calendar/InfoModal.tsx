import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { ISlot } from '../../entities/types/ISlot';
import { ISpace } from '../../entities/types/ISpace';
import { format } from 'date-fns';

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
}

const InfoModal: React.FC<InfoModalProps> = ({
  openInfoModal,
  handleInfoModalClose,
  info,
}) => {
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
            color: info?.status === 'CONFIRMED' ? 'green' : 'red',
          }}
        >
          {info?.status}
        </Typography>
        <Typography>Space Name: {info?.space.name}</Typography>
        <Typography>Booked By: {info?.userEmail}</Typography>
        <Typography>
          Booked time:{' '}
          {info?.bookingTime ? new Date(info.bookingTime).toDateString() : ''}
        </Typography>
        <Typography>Price: {info?.space.baseRentalCost}</Typography>
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
        <Button onClick={handleInfoModalClose} color="primary">
          Change Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
