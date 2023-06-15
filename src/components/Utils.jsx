import { IconButton, Typography, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';

const Utils = (props) => {
  const {
    saveCallback,
    className,
    pageInd,
    setPageInd,
    pageName,
    setPageName,
    unsaved,
  } = props;

  const [pageNameCurr, setPageNameCurr] = useState(pageName);

  useEffect(() => {
    setPageNameCurr(pageName);
  }, [pageName]);

  const prevPage = () => {
    if (pageInd > 0) {
      setPageInd(pageInd - 1);
    }
  };

  const nextPage = () => {
    setPageInd(pageInd + 1);
  };

  let saveButtonColor = unsaved ? 'warning' : 'action';

  const handleNameBlur = (e) => {
    if (pageNameCurr !== pageName) {
      setPageName(pageNameCurr);
    }
  };

  const pageTitle = (
    <TextField
      value={pageNameCurr}
      onBlur={handleNameBlur}
      size="small"
      variant="standard"
      onChange={(e) => setPageNameCurr(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      }}
    />
  );

  // const pageTitle = (
  //   <TextField defaultValue={pageName} onBlur={handleNameBlur} />
  // );

  return (
    <div className={className}>
      <div className="UtilTitle">{pageTitle}</div>
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
