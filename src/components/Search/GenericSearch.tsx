import { Grid, Stack, Autocomplete, TextField } from "@mui/material";
import { SyntheticEvent } from "react";
import { searchOptionType } from "../../../pages/clients";
import { searchOnChangeHandler } from "../../containers/ClientTableContainer/ClientTableContainer";


export type searchOnChangeHandlerType = (event: SyntheticEvent<Element, Event>, inputValue?: string) => void;

type GenericSearchProps = {
  pageTitle    : string,
  searchOptions: searchOptionType,
}

export const GenericSearch = (props: GenericSearchProps) => {
  return (
    <>
      <Grid item key="search-box" xs>
        <Stack sx={{ pt:2 }} alignItems="flex-end" >
          <Autocomplete
            sx={{ width: '40%' }}
            freeSolo
            id="searchOptions"
            size="small"
            options={props.searchOptions.map((option) => option)}
            renderInput={(params) => <TextField {...params} label={'Search for ' + props.pageTitle} />}
            onInputChange={searchOnChangeHandler}
          />
        </Stack>
      </Grid>
    </>
  );
}