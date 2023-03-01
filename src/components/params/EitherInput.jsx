import { IconButton } from '@mui/material';
import { LOOKUP_FLAG, INPUT_TYPES } from '../../tools/types';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import VariableInput from './VariableInput';
import AnyInput from './AnyInput';

const EitherInput = (props) => {
    const { input, params, update } = props;
    const [inputType, setInputType] = useState(INPUT_TYPES.RAW);

    const inputIcon = {};
    inputIcon[INPUT_TYPES.RAW] = <EditIcon />;
    inputIcon[INPUT_TYPES.VARIABLE] = <DataObjectIcon />;
    const inputTypeIcon = inputIcon[inputType];

    useEffect(() => {
        if (
            params[input.name] &&
            typeof params[input.name] === 'string' &&
            params[input.name].charAt(0) === LOOKUP_FLAG
        ) {
            setInputType(INPUT_TYPES.VARIABLE);
        }
    }, []);

    const handleInputTypeClick = () => {
        update(undefined);
        if (inputType === INPUT_TYPES.RAW) {
            setInputType(INPUT_TYPES.VARIABLE);
        } else {
            setInputType(INPUT_TYPES.RAW);
        }
    };

    let inputButton = (
        <IconButton edge='end' onClick={handleInputTypeClick}>
            {inputTypeIcon}
        </IconButton>
    );

    if (inputType === INPUT_TYPES.VARIABLE) {
        const updateWithFlag = (value) => {
            update(LOOKUP_FLAG + value);
        };
        return (
            <VariableInput
                input={input}
                params={params}
                secondary={inputButton}
                update={updateWithFlag}
            />
        );
    }

    if (inputType === INPUT_TYPES.RAW) {
        return (
            <AnyInput
                input={input}
                params={params}
                secondary={inputButton}
                update={update}
            />
        );
    }

    return <div />;
};

export default EitherInput;
