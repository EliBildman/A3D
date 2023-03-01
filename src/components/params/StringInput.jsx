import { TextField, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const StringInput = (props) => {
    const { input, params, update, secondary } = props;

    const handleChange = (event) => {
        update(event.target.value);
    };

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>
                    <FormatQuoteIcon />
                </Avatar>
            </ListItemAvatar>
            <TextField
                autoComplete='off'
                id='filled-helperText'
                label={input.name}
                defaultValue={params[input.name]}
                variant='filled'
                onChange={handleChange}
            />
        </ListItem>
    );
};

export default StringInput;
