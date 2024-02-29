import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    amount: '',
    category: ''
  });
  const [expenses, setExpenses] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;

      const response = await axios.get(`http://localhost:3500/api/expense/income/${id}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });
      console.log(response.data)

      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error fetching expenses. Please try again later.');
    }
  };

  const fetchCategories = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken } = userData;

      const response = await axios.get(`http://localhost:3500/api/category/get-category-by-type/Income`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });
      console.log(response.data)

      const categories = response.data.map(category => category.category);
      setCategoryOptions(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories. Please try again later.');
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

      const response = await axios.post(`http://localhost:3500/api/expense/income/${id}`, expenseForm, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });
      console.log(response.data)
      toast.success("Expense added successfully.");
      handleCloseModal();
      fetchData(); // Fetch updated expenses after adding a new one
    } catch (error) {
      console.error('Error submitting expense form:', error);
      toast.error('Error submitting expense form. Please try again later.');
    }
  };

  const handleEditExpense = (index) => {
    console.log('Edit expense:', expenses[index]);
  };

  const handleDeleteExpense = async (index) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;

      const response = await axios.delete(`http://localhost:3500/api/expense/income/${id}/${expenses[index]._id}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });

      console.log('Expense deleted:', response.data);
      toast.success("Expense deleted successfully.");
      fetchData(); // Fetch updated expenses after deleting one
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error deleting expense. Please try again later.');
    }
  };

  return (
    <>
      <div className='m-6'>
        <div className="bg-white p-4 mb-4 flex justify-end">
          <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Income</Button>
        </div>
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.date.substring(0, 10)}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
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
          count={expenses.length} // Set count to the total number of expenses
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
              id="date"
              name="date"
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
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              fullWidth
              value={expenseForm.category}
              onChange={handleInputChange}
            >
              {categoryOptions.map((category, index) => (
                <MenuItem key={index} value={category}>{category}</MenuItem>
              ))}
            </Select>
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
      </div>
    </>
  );
};

export default DetailsTable;
