"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  TableContainer,
  Paper,
} from "@mui/material";

interface TableSkeletonLoaderProps {
  rows: number;
  columns: number;
}

export default function TableSkeletonLoader({
  rows,
  columns,
}: TableSkeletonLoaderProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }, (_, i) => (
              <TableCell key={`head-${i}`}>
                <Skeleton variant="text" width={120} height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton variant="text" width={120} height={20} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
