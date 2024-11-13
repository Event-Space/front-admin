import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ISpace } from '../../../entities/types/ISpace';

interface SpacesTableProps {
  data: ISpace[];
  onEditClick: (space: ISpace) => void;
  onDeleteClick: (space: ISpace) => void;
}

export default function SpacesTable({
  data,
  onEditClick,
  onDeleteClick,
}: SpacesTableProps) {
  return (
    <Table component={Paper} style={{ marginTop: '20px' }}>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Image</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Max Capacity</TableCell>
          <TableCell>Rental Cost</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((space, index) => (
          <TableRow key={space.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <img
                src={`https://space-event.kenuki.org/order-service/api/v1/files/${space.imageUrl}`}
                width="300px"
                height="200px"
                alt={space.name}
                style={{ objectFit: 'cover' }}
              />
            </TableCell>
            <TableCell>{space.name}</TableCell>
            <TableCell>{space.address}</TableCell>
            <TableCell>{space.location}</TableCell>
            <TableCell>{space.size}</TableCell>
            <TableCell>{space.maxCapacity}</TableCell>
            <TableCell>{`${space.baseRentalCost} KZT`}</TableCell>
            <TableCell>
              <Button onClick={() => onEditClick(space)} color="primary">
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() => onDeleteClick(space)}
                color="error"
                style={{ marginLeft: '10px' }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
