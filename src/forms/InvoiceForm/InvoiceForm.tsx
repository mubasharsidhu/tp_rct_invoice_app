import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Divider, Grid, Stack, TextField, TextFieldProps } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


const InvoiceItemSchema = yup.object({
  item : yup.string().required(),
  price: yup.number().required().typeError("price must be a positive number")
})

type InvoiceItemSchemaData = yup.InferType<typeof InvoiceItemSchema>

const InvoiceSchema = yup.object({
  invoiceDate   : yup.string().required(),
  invoiceDueDate: yup.string().required(),
  invoiceNumber : yup.string().required(),
  projectCode   : yup.string().required(),
  items         : yup.array().of(InvoiceItemSchema).required().min(1)
})


export interface InvoiceInputParams extends Omit<yup.InferType<typeof InvoiceSchema>, 'items'> {
  items: InvoiceItemSchemaData[]
}


export type InvoiceFormProps = {
  genericError?             : string
  currentInvoice?           : InvoiceInputParams | undefined
  onInvoiceDataSubmitRequest: (data: InvoiceInputParams) => unknown
}


export const InvoiceForm = (props: InvoiceFormProps) => {


  const { control, register, handleSubmit, formState: { errors } } = useForm<InvoiceInputParams>({
    mode: "onBlur",
    resolver: yupResolver(InvoiceSchema),
    defaultValues: {
      items: [{}]
    }
  });

  const { fields: items, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "items",
  });


  useEffect(() => {
    //reset(props.currentInvoice);
  }, [props.currentInvoice]);


  const [value, setValue] = useState<Date | null>(null);

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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="Date mobile"
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={(newValue: Date | null) => {
                setValue(newValue);
              }}
              renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} />}
            />
          </LocalizationProvider>


          <TextField
            id="invoiceDate"
            name="invoiceDate"
            label="Date"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("invoiceDate", { required: true }) }}
            error={!!errors.invoiceDate}
            helperText={errors.invoiceDate?.message ?? " "}
          />

          <TextField
            id="invoiceDueDate"
            name="invoiceDueDate"
            label="Due Date"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("invoiceDueDate", { required: true }) }}
            error={!!errors.invoiceDueDate}
            helperText={errors.invoiceDueDate?.message ?? " "}
          />

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
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              sx={{p:2, mt:2, bgcolor: (theme) =>theme.palette.grey[200] }}
            >

              <Button
                type="button"
                variant="contained"
                disabled={items.length === 1}
                onClick={(ev) => {
                  ev.preventDefault();
                  remove(index);
                }}
              >-</Button>

              <TextField
                id="item"
                name="item"
                label="Item"
                required={true}
                margin="dense"
                inputProps={{...register(`items.${index}.item`), 'data-test': `invoice-item-${index}-item`} }
                error={!!errors.items?.[index]?.item ?? false}
                helperText={errors.items?.[index]?.item?.message}
              />

              <TextField
                id="price"
                name="price"
                label="Price"
                required={true}
                margin="dense"
                inputProps={{...register(`items.${index}.price`), 'data-test': `invoice-item-${index}-price`} }
                error={!!errors.items?.[index]?.price}
                helperText={errors.items?.[index]?.price?.message}
              />

            </Stack>

          ))}
          <Button
            variant="contained"
            sx={{mt:2}}
            onClick={(ev) => {
              ev.preventDefault();
              append({})
            }}
          >+</Button>



          <Button type="submit" fullWidth={true} variant="contained" sx={{mt:2}}>Submit Invoice</Button>

        </Box>
      </Box>
    </>
  )
}
