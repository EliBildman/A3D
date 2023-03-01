import { IconButton, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Utils = (props) => {
    const { saveCallback, className, pageInd, setPageInd, unsaved } = props;

    const prevPage = () => {
        if (pageInd > 0) {
            setPageInd(pageInd - 1);
        }
    };

    const nextPage = () => {
        setPageInd(pageInd + 1);
    };

    let saveButtonColor = unsaved ? 'warning' : 'action';

    return (
        <div className={className}>
            <IconButton onClick={prevPage}>
                <ChevronLeftIcon />
            </IconButton>
            <Typography>{pageInd}</Typography>
            <IconButton onClick={nextPage}>
                <ChevronRightIcon />
            </IconButton>
            <IconButton onClick={saveCallback}>
                <SaveIcon color={saveButtonColor} />
            </IconButton>
        </div>
    );
};

export default Utils;
