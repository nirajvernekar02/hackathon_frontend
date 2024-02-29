import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem } from '@mui/material';

const ExpenseForm = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3500/api/expense/expenses/65e03a9d123a8c1ab5130e70');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    date: '',
    amount: '',
    category: '',
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    amount: Yup.number().required('Amount is required'),
    category: Yup.string().required('Category is required'),
  });

  const onSubmit = async (values) => {
    try {
      await axios.post('http://localhost:3500/api/expense/expense/65e03a9d123a8c1ab5130e70', values);
      console.log('Expense added successfully:', values);
      // Add any success handling logic here
    } catch (error) {
      console.error('Error adding expense:', error);
      // Add any error handling logic here
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        id="date"
        label="Date"
        type="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        error={formik.touched.date && Boolean(formik.errors.date)}
        helperText={formik.touched.date && formik.errors.date}
      />
      <TextField
        id="amount"
        label="Amount"
        type="number"
        value={formik.values.amount}
        onChange={formik.handleChange}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
      />
      <TextField
        id="category"
        select
        label="Category"
        value={formik.values.category}
        onChange={formik.handleChange}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.name}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default ExpenseForm;
