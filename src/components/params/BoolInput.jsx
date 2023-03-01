import {
    Checkbox,
    ListItemText,
    Box,
    ListItem,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import FlakyIcon from '@mui/icons-material/Flaky';

const BoolInput = (props) => {
    const { input, params, update, secondary } = props;

    const handleChange = (event) => {
        update(event.target.checked);
    };

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>
                    <FlakyIcon />
                </Avatar>
            </ListItemAvatar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Checkbox
                    onChange={handleChange}
                    checked={params[input.name] ?? false}
                />
                <ListItemText primary={input.name} />
            </Box>
        </ListItem>
    );
};

export default BoolInput;
