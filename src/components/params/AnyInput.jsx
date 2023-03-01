import { TextField, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { DATA_TYPES, detectType, typeList } from '../../tools/types';
import FlakyIcon from '@mui/icons-material/Flaky';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NumbersIcon from '@mui/icons-material/Numbers';

const AnyInput = (props) => {
    const { input, params, update, secondary } = props;
    const [type, setType] = useState(DATA_TYPES.ANY);

    useEffect(() => {
        if (params[input.name]) {
            const t = typeof params[input.name];
            setType(typeList[t]);
        }
    }, [params, input.name, setType]);

    const handleChange = (event) => {
        const [newType, value] = detectType(event.target.value);
        setType(newType);
        update(value);
    };

    const icon = {};
    icon[DATA_TYPES.STRING] = <FormatQuoteIcon />;
    icon[DATA_TYPES.NUMBER] = <NumbersIcon />;
    icon[DATA_TYPES.BOOL] = <FlakyIcon />;
    icon[DATA_TYPES.ANY] = <QuestionMarkIcon />;
    const avatar = icon[type];

    return (
        <ListItem secondaryAction={secondary}>
            <ListItemAvatar>
                <Avatar>{avatar}</Avatar>
            </ListItemAvatar>
            <TextField
                id='filled-helperText'
                label={input.name}
                defaultValue={params[input.name] ?? ''}
                variant='filled'
                onChange={handleChange}
            />
        </ListItem>
    );
};

export default AnyInput;
