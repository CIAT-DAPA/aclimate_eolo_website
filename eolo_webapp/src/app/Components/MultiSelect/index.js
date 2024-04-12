"use client";
import { useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import styles from "./multi_select.module.css"

const ITEM_HEIGHT = 42;
const ITEM_PADDING_TOP = 6;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({arrayData, label, data, setData}) {
  

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setData(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <div className={styles.select_container}>
      <FormControl sx={{ m: 1, minWidth: 160, width: "60%" }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={data}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {arrayData && arrayData.length > 0 &&  arrayData.map((d) => (
            <MenuItem key={d} value={d}>
              <Checkbox checked={data.indexOf(d) > -1} />
              <ListItemText primary={d} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}