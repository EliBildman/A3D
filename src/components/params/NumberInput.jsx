import { TextField, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';

const NumberInput = (props) => {
    const { input, params, update, secondary } = props;

    const handleChange = (event) => {
        update(event.target.value);
    };

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>
                    <NumbersIcon />
                </Avatar>
            </ListItemAvatar>
            <TextField
                label={input.name}
                type='number'
                defaultValue={params[input.name]}
                variant='filled'
                onChange={handleChange}
            />
        </ListItem>
    );
};

export default NumberInput;
