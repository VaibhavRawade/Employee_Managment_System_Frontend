import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addEmployee, getEmployeeById, updateEmployee } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import { TextField, Button, MenuItem, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const CenteredSpinner = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    password: '',
    phoneNo : '',
    department: { id: '' },
  });
  const [departments, setDepartments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);

        if (id) {
          const employeeData = await getEmployeeById(id);
          if (employeeData) {
            setEmployee({
              firstName: employeeData.firstName || '',
              lastName: employeeData.lastName || '',
              email: employeeData.email || '',
              age: employeeData.age || '',
              phoneNo: employeeData.phoneNo || '',
               password: employeeData.password || '',
              department: {
                id: employeeData.department ? employeeData.department.id : '',
              },
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

 

  const handleChange = (e) => {

  const { name, value } = e.target;

  // Allow only letters and spaces in names
  if (
    (name === 'firstName' || name === 'lastName') &&
    !/^[A-Za-z ]*$/.test(value)
  ) {
    return;
  }

  if (name === 'department.id') {

    setEmployee({
      ...employee,
      department: { id: value }
    });

  } else {

    setEmployee({
      ...employee,
      [name]: name === 'age'
        ? Number(value)
        : value
    });
  }
};


const handlePhoneChange = (e) => {
  const value = e.target.value;

  // allow ONLY digits and max 10 numbers
  if (/^\d*$/.test(value) && value.length <= 10) {
    setEmployee({
      ...employee,
      phoneNo: value
    });
  }
};

 




  const handleSubmit = async e => {

            e.preventDefault();

            setIsLoading(true);
            try {

              let savedEmployee;
              if (id) {
                savedEmployee = await updateEmployee(id, employee);
              } else {
                savedEmployee = await addEmployee(employee);
              }

              // Upload image if selected
              if (image && savedEmployee?.id) {

                const formData = new FormData();

                formData.append("image", image);

                await fetch(
                    `http://localhost:8082/api/employees/${savedEmployee.id}/upload-image`,
                    {
                        method: "POST",
                        body: formData
                    }
              );
          }

          navigate('/employees');

      } catch (error) {
            console.error('Error saving employee:', error);
      } finally {
        setIsLoading(false);
      }
  };


  

    if (isLoading) {
      return (
        <CenteredSpinner>
          <CircularProgress />
        </CenteredSpinner>
      );
    }

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' } }}>
        <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
        <TextField label="First Name" name="firstName" value={employee.firstName} onChange={handleChange} required />
        <TextField label="Last Name" name="lastName" value={employee.lastName} onChange={handleChange}  required />
        <TextField label="Email" name="email" type="email" value={employee.email} onChange={handleChange} required />
         <TextField label="Password" name="password" type="password" value={employee.password} onChange={handleChange} required />
        <TextField label="Age" name="age" type="number" value={employee.age} onChange={handleChange}   required inputProps={{ min: 1, max: 65  }} />

    
    <TextField
  label="Phone No"
  name="phoneNo"
  type="text"
  value={employee.phoneNo}
  onChange={handlePhoneChange}
  inputProps={{ maxLength: 10 }}
  required
/>


        <TextField select label="Department" name="department.id" value={employee.department.id || ''} onChange={handleChange} required>
          <MenuItem value="">Select Department</MenuItem>
          {departments.map(department => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </TextField>

      <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {image && (
              <p style={{ marginTop: '8px' }}>
                Selected File: {image.name}
              </p>
            )}
      </Box>

        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
          Save
        </Button>
      </Box>
    );
  };

  export default EmployeeForm;
