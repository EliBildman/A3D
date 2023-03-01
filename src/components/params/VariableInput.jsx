import { TextField, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import { DATA_TYPES, LOOKUP_FLAG } from '../../tools/types';
import FlakyIcon from '@mui/icons-material/Flaky';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NumbersIcon from '@mui/icons-material/Numbers';
import DataObjectIcon from '@mui/icons-material/DataObject';

const VariableInput = (props) => {
    const { input, params, update, secondary } = props;

    const handleChange = (event) => {
        update(event.target.value);
    };

    const icon = {};
    icon[DATA_TYPES.STRING] = <FormatQuoteIcon />;
    icon[DATA_TYPES.NUMBER] = <NumbersIcon />;
    icon[DATA_TYPES.BOOL] = <FlakyIcon />;
    icon[DATA_TYPES.ANY] = <QuestionMarkIcon />;
    const avatar = icon[input.type];

    let defaultVal = params[input.name];
    if (defaultVal && defaultVal.charAt(0) === LOOKUP_FLAG) {
        defaultVal = defaultVal.substring(1);
    }

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>{avatar}</Avatar>
            </ListItemAvatar>
            <TextField
                autoComplete='off'
                id='filled-helperText'
                label={input.name}
                defaultValue={defaultVal}
                variant='filled'
                onChange={handleChange}
            />
        </ListItem>
    );
};

export default VariableInput;
