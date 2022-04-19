import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Autocomplete, Box, Button, Divider, Stack, TextField, TextFieldProps } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { SyntheticEvent, useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CommonJobs } from "../../api/common";
import { ComboBox } from "../../components/ComboBox/ComboBox";


const InvoiceItemSchema = yup.object({
  item : yup.string().required("Item is a required field"),
  price: yup.number().required().typeError("Price must be a positive number")
})


type InvoiceItemSchemaData = yup.InferType<typeof InvoiceItemSchema>


const InvoiceSchema = yup.object({
  clientID      : yup.string().required("Please select a client"),
  invoiceDate   : yup.date().required("The Date field is required.").typeError("The Date field is required and must have a valid Date format. (mm/dd/yyyy"),
  invoiceDueDate: yup.date().required("The Due Date field is required.").typeError("The Due Date field is required and must have a valid Date format. (mm/dd/yyyy"),
  invoiceNumber : yup.string().required("Invoice Number is a required field"),
  projectCode   : yup.string().required("Project Code is a required field"),
  items         : yup.array().of(InvoiceItemSchema).required().min(1),
})

export interface InvoiceInputParams extends Omit<yup.InferType<typeof InvoiceSchema>, 'items'> {
  totalValue: number;
  items     : InvoiceItemSchemaData[]
}


export type InvoiceFormProps = {
  genericError?             : string,
  currentInvoice?           : InvoiceInputParams | undefined,
  allClientsList?           : Array<{ id: string, label: string }> | undefined,
  selectedClientID          : string,
  setSelectedClientID       : (selectedClientID: string) => void,
  onInvoiceDataSubmitRequest: (data: InvoiceInputParams) => unknown
}


export const InvoiceForm = (props: InvoiceFormProps) => {

  const [invoiceDate, setInvoiceDate]       = useState<Date | null>(null);
  const [invoiceDueDate, setInvoiceDueDate] = useState<Date | null>(null);

  const { control, register, handleSubmit, setFocus, reset, formState: { errors } } = useForm<InvoiceInputParams>({
    mode         : "onBlur",
    resolver     : yupResolver(InvoiceSchema),
    defaultValues: {
      clientID: "",
      items: [{}]
    }
  });

  const { fields: items, append, remove } = useFieldArray({
    control,
    name: "items",
  });


  // To enable focus on change, when selecting after null value
  useEffect(() => {
    if (invoiceDate!==null) {
      setFocus("invoiceDate");
    }
  }, [invoiceDate]);

  // To enable focus on change, when selecting after null value
  useEffect(() => {
    if (invoiceDueDate!==null) {
      setFocus("invoiceDueDate");
    }
  }, [invoiceDueDate]);


  useEffect(() => {
    reset(props.currentInvoice);
  }, [props.currentInvoice]);

  return (
    <>

      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center' }} >

        <Box
          maxWidth="sm"
          component="form"
          noValidate
          onSubmit={handleSubmit(props.onInvoiceDataSubmitRequest)}
        >
          {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

          <Controller
            name="clientID"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error } }) => {
              return (
                <Autocomplete
                  {...field}
                  freeSolo
                  options={props.allClientsList ? props.allClientsList.map((option) => option) : []}
                  value={field.value && props.allClientsList
                    ? props.allClientsList.find((obj)=>{
                        return obj.id === field.value ? obj.id : ""
                      })
                    : ""
                  }
                  onChange={(event: SyntheticEvent<Element, Event>, optionObject: { id: string, label: string } | string | null ): void => {
                    const clientID = optionObject && typeof optionObject === 'object' ? optionObject.id : "";
                    props.setSelectedClientID(clientID);
                    //console.log('optionObject: ', optionObject)
                    return field.onChange(clientID);
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        id={"clientID"}
                        name={"clientID"}
                        label={"Select a Client"}
                        required={true}
                        margin="dense"
                        error={!!errors.clientID}
                        helperText={errors.clientID?.message ?? " "}
                        inputRef={ref}
                      />
                    )
                  }}
                />
              )
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="invoiceDate"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <DatePicker
                    {...field}
                    label="Date"
                    value={field.value ? CommonJobs.formatDate(field.value) : "" }
                    disablePast={true}
                    allowSameDateSelection={true}
                    InputProps={{ ...register("invoiceDate", { required: true } ) }}
                    onChange={(newValue: Date | null) => {
                      setInvoiceDate(newValue);
                      return field.onChange(newValue);
                    }}
                    renderInput={(params: TextFieldProps) => {
                      return (
                        <TextField
                          id="invoiceDate"
                          name="invoiceDate"
                          label="Date"
                          required={true}
                          fullWidth={true}
                          margin="dense"
                          helperText={errors.invoiceDate?.message ?? "mm/dd/yyyy"}
                          inputRef={ref}
                          {...params}
                          error={!!errors.invoiceDate}
                        />
                      )
                    }}
                  />
                )}
              }
            />

            <Controller
              name="invoiceDueDate"
              control={control}
              //defaultValue={new Date()}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    value={field.value ? CommonJobs.formatDate(field.value) : "" }
                    disablePast={true}
                    allowSameDateSelection={true}
                    InputProps={{ ...register("invoiceDueDate", { required: true } ) }}
                    onChange={(newValue: Date | null) => {
                      setInvoiceDueDate(newValue);
                      return field.onChange(newValue);
                    }}
                    renderInput={(params: TextFieldProps) => {
                      return (
                        <TextField
                          id="invoiceDueDate"
                          name="invoiceDueDate"
                          label="Due Date"
                          required={true}
                          fullWidth={true}
                          margin="dense"
                          helperText={errors.invoiceDueDate?.message ?? "mm/dd/yyyy"}
                          inputRef={ref}
                          {...params}
                          error={!!errors.invoiceDueDate}
                        />
                      )
                    }}
                  />
                )}
              }
            />
          </LocalizationProvider>

          <TextField
            id="invoiceNumber"
            name="invoiceNumber"
            label="Number"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("invoiceNumber", { required: true }) }}
            error={!!errors.invoiceNumber}
            helperText={errors.invoiceNumber?.message ?? " "}
          />

          <TextField
            id="projectCode"
            name="projectCode"
            label="Project Code"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("projectCode", { required: true }) }}
            error={!!errors.projectCode}
            helperText={errors.projectCode?.message ?? " "}
          />


          { !items.length && errors.items && !errors.items.length ? <ErrorMessage message={(errors.items as any).message} /> : null}

          {items.map((field, index) => (

            <Stack
              key={field.id}
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              justifyContent="space-evenly"
              sx={{
                mt:1, p:1, bgcolor: (theme) =>theme.palette.grey[200], borderRadius: 1,
                display:'flex', flexDirection:'row', alignItems:'center'
              }}
              >
                <Button
                  type="button"
                  variant="contained"
                  disabled={items.length === 1}
                  onClick={(ev) => {
                    ev.preventDefault();
                    remove(index);
                  }}
                  sx={{ height: '100%', mb:2 }}
                >-</Button>

                <TextField
                  id="item"
                  name="item"
                  label="Item"
                  required={true}
                  inputProps={{...register(`items.${index}.item`)} }
                  error={!!errors.items?.[index]?.item ?? false}
                  helperText={errors.items?.[index]?.item?.message ?? " "}
                />

                <TextField
                  id="price"
                  name="price"
                  label="Price"
                  required={true}
                  inputProps={{...register(`items.${index}.price`)} }
                  error={!!errors.items?.[index]?.price}
                  helperText={errors.items?.[index]?.price?.message ?? " "}
                />

            </Stack>
          ))}

          <Button
            variant="contained"
            onClick={(ev) => {
              ev.preventDefault();
              append({})
            }}
            sx={{mt:2}}
          >+</Button>

          <Button type="submit" fullWidth={true} variant="contained" sx={{mt:2}}>Submit Invoice</Button>

        </Box>
      </Box>
    </>
  )
}
