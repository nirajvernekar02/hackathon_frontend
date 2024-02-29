import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, TablePagination, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    frequency: '',
    date: '',
    amount: '',
    startDate: '',
    endDate: '',
    customCategory: ''
  });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;

      const response = await axios.get(`http://localhost:3500/api/expense/recurring-expenses/${id}?auth-token=${authtoken}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });

      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error fetching expenses. Please try again later.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm({ ...expenseForm, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;

      const response = await axios.post(`http://localhost:3500/api/expense/recurring-expenses/${id}`, expenseForm, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });

      toast.success("Expense added successfully.");
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error submitting expense form:', error);
      toast.error('Error submitting expense form. Please try again later.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken } = userData;

      await axios.delete(`http://localhost:3500/api/expense/recurring-expenses/${id}/${expenses[index]._id}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });

      toast.success("Expense deleted successfully.");
      fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error deleting expense. Please try again later.');
    }
  };

  return (
    <>
      <div className='m-6'>
        <div className="bg-white p-4 mb-4 flex justify-end">
          <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Expense</Button>
        </div>
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Frequency</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Custom Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.frequency}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.startDate}</TableCell>
                  <TableCell>{expense.endDate}</TableCell>
                  <TableCell>{expense.customCategory}</TableCell>
                  <TableCell>
                  <IconButton onClick={() => handleEditExpense(index)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteExpense(index)} color="secondary">
          <DeleteIcon />
        </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="frequency"
              name="frequency"
              label="Frequency"
              fullWidth
              value={expenseForm.frequency}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="date"
              name="date"
              label="Date"
              type="date"
              fullWidth
              value={expenseForm.date}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={expenseForm.amount}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="startDate"
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              value={expenseForm.startDate}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="endDate"
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              value={expenseForm.endDate}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="customCategory"
              name="customCategory"
              label="Custom Category"
              fullWidth
              value={expenseForm.customCategory}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </>
  );
};

export default DetailsTable;
