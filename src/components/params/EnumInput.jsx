import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    ListItem,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const EnumInput = (props) => {
    const { input, params, update, secondary } = props;

    const handleChange = (event) => {
        update(event.target.value);
    };

    const options = input.options.map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
    ));

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>
                    <FormatListNumberedIcon />
                </Avatar>
            </ListItemAvatar>
            <FormControl variant='filled' sx={{ width: '100%' }}>
                <InputLabel>{input.name}</InputLabel>
                <Select
                    label={input.name}
                    value={params[input.name] ?? ''}
                    onChange={handleChange}
                >
                    {options}
                </Select>
            </FormControl>
        </ListItem>
    );
};

export default EnumInput;
