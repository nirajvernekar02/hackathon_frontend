import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Budget = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    budgetAmount: '',
    month: '',
    year: ''
  });
  const [categories, setCategories] = useState([]);
  const [dataBudget, setDataBudget] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/category/get-category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;
      const response = await axios.get(`http://localhost:3500/api/budget/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });
      console.log(response.data)
      setDataBudget(response.data.budgets); // Set dataBudget to response.data.budgets
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data. Please try again later.');
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
    setBudgetForm({ ...budgetForm, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { category, budgetAmount, month, year } = budgetForm;
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;
      const response = await axios.post(`http://localhost:3500/api/budget/budget/${id}`, {
        category: category,
        budgetAmount: parseInt(budgetAmount),
        month: parseInt(month),
        year: parseInt(year)
      }, {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      });
      console.log('Budget form submitted:', response.data);
      toast.success("Budget added successfully.");
      handleCloseModal();
      fetchCategories(); // Fetch updated categories after adding a new one
    } catch (error) {
      console.error('Error submitting budget form:', error);
      toast.error('Error submitting budget form. Please try again later.');
    }
  };
  const handleDeleteExpense = async (index) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { authtoken, id } = userData;

      const response = await axios.delete(`http://localhost:3500/api/budget/budget/${id}/${dataBudget[index]._id}`, {
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
          <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Budget</Button>
        </div>
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Budget Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataBudget.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((budget, index) => (
                <TableRow key={index}>
                  <TableCell>{budget.category}</TableCell>
                  <TableCell>{budget.budgetAmount}</TableCell>
                  <TableCell>{budget.month}</TableCell>
                  <TableCell>{budget.year}</TableCell>
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
          count={dataBudget.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogContent>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              fullWidth
              value={budgetForm.category}
              onChange={handleInputChange}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.category}>{category.category}</MenuItem>
              ))}
            </Select>
            <TextField
              margin="dense"
              id="budgetAmount"
              name="budgetAmount"
              label="Budget Amount"
              type="number"
              fullWidth
              value={budgetForm.budgetAmount}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="month"
              name="month"
              label="Month"
              type="number"
              fullWidth
              value={budgetForm.month}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="year"
              name="year"
              label="Year"
              type="number"
              fullWidth
              value={budgetForm.year}
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
      </div>
    </>
  );
};

export default Budget;