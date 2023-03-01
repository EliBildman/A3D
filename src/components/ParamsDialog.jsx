import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    Divider,
} from '@mui/material';
import { INPUT_TYPES, DATA_TYPES, OUT_FLAG } from '../tools/types';
import StringInput from './params/StringInput';
import NumberInput from './params/NumberInput';
import BoolInput from './params/BoolInput';
import EnumInput from './params/EnumInput';
import AnyInput from './params/AnyInput';
import VariableInput from './params/VariableInput';
import EitherInput from './params/EitherInput';
import Output from './params/Output';
import EditIcon from '@mui/icons-material/Edit';
import DataObject from '@mui/icons-material/DataObject';

const ParamsDialog = (props) => {
    const { open, handleClose, title, input, output, params, updateParams } =
        props;

    const input_items = input.map((inp, ind) => {
        if (inp.input === INPUT_TYPES.RAW) {
            if (inp.type === DATA_TYPES.STRING) {
                return (
                    <StringInput
                        key={ind}
                        input={inp}
                        params={params}
                        update={updateParams(inp.name)}
                        secondary={<EditIcon />}
                    />
                );
            }
            if (inp.type === DATA_TYPES.NUMBER) {
                return (
                    <NumberInput
                        key={ind}
                        secondary={<EditIcon />}
                        input={inp}
                        params={params}
                        update={updateParams(inp.name)}
                    />
                );
            }
            if (inp.type === DATA_TYPES.BOOL) {
                return (
                    <BoolInput
                        input={inp}
                        params={params}
                        update={updateParams(inp.name)}
                        secondary={<EditIcon />}
                        key={ind}
                    />
                );
            }
            if (inp.type === DATA_TYPES.ENUM) {
                return (
                    <EnumInput
                        key={ind}
                        secondary={<EditIcon />}
                        input={inp}
                        params={params}
                        update={updateParams(inp.name)}
                    />
                );
            }
            if (inp.type === DATA_TYPES.ANY) {
                return (
                    <AnyInput
                        key={'in_' + ind}
                        input={inp}
                        params={params}
                        update={updateParams(inp.name)}
                        secondary={<EditIcon />}
                    />
                );
            }
        }
        if (inp.input === INPUT_TYPES.VARIABLE) {
            return (
                <VariableInput
                    key={ind}
                    input={inp}
                    params={params}
                    update={updateParams(inp.name)}
                    secondary={<DataObject />}
                />
            );
        }
        if (inp.input === INPUT_TYPES.EITHER) {
            return (
                <EitherInput
                    key={ind}
                    input={inp}
                    params={params}
                    update={updateParams(inp.name)}
                />
            );
        }
        return <div key={ind} />;
    });

    const output_items = output.map((out, ind) => {
        return (
            <Output
                key={ind}
                output={out}
                params={params}
                inputs={input}
                update={updateParams(OUT_FLAG + out.name)}
            ></Output>
        );
    });

    let divider = <div />;
    if (input_items.length > 0 && output_items.length > 0) {
        divider = <Divider />;
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle align='center'>{title}</DialogTitle>
            <DialogContent>
                <List
                    sx={{
                        width: '100%',
                        minWidth: 200,
                    }}
                >
                    {input_items}
                    {divider}
                    {output_items}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ParamsDialog;
