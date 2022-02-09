import React from 'react';
import{ useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography, TextField, Button } from '@material-ui/core';
import { IconText } from '../../../../components/atoms';
import { SectionHeader } from '../../../../components/molecules';
import axios from "axios";

const useStyles = makeStyles(theme => ({
  icon: {
    background: 'transparent',
    borderRadius: 0,
  },
  iconText: {
    fontWeight: 700,
    marginLeft: theme.spacing(2),
  },
  form: {
    '& .MuiTextField-root': {
      background: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-input': {
      background: theme.palette.background.paper,
    },
  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  uploadButton: {
    display: 'flex',
    justifyContent: 'center',
    border: '1px solid transparent',
    background: theme.palette.alternate.dark,
    textTransform: 'lowercase',
    '& .icon-text': {
      width: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    },
  },
}));

const Application = props => {
  const { className, ...rest } = props;
  const classes = useStyles();


  const [baseImage, setBaseImage] = useState("");
  const [classified,setClassified]=useState(false)
  const [responseFromBackend,setResponseFromBackend]=useState("")


  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
    axios
      .post(
        "/api/predict",
        { image: base64 }, //send this data to our server, and our server will send data to aws endpoint
      )
      .then(res => {
          setResponseFromBackend(res.data.message)
          setClassified(true)
      })
      .catch(err => {
        console.log('Error', err);
      });
  };

//function to convert our image to base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  let showResults=null
  if(classified){
    showResults=
      <>
    <Grid item xs={12} data-aos="fade-up">
      <Typography
        variant="subtitle1"
        color="textPrimary"
        className={classes.inputTitle}>
        We detected {responseFromBackend}
      </Typography>
    </Grid>
    <Button
    variant="outlined"
    component="label"
    color="primary"
    fullWidth
    size="large"
    onClick={()=>setClassified(false)}>
    Classify another image</Button>
    </>
  }

  let showForm=null
  if(!classified){
    showForm=
    <>
    <Grid item xs={12} data-aos="fade-up">
      <Typography
        variant="subtitle1"
        color="textPrimary"
        className={classes.inputTitle}
      >
        Patient's name
      </Typography>
      <TextField
        placeholder=" Full name"
        variant="outlined"
        size="medium"
        name="fullname"
        fullWidth
        type="text"
      />
    </Grid>
    <Grid item xs={12} data-aos="fade-up">
      <Typography
        variant="subtitle1"
        color="textPrimary"
        className={classes.inputTitle}
      >
        Patient's E-mail
      </Typography>
      <TextField
        placeholder="E-mail address"
        variant="outlined"
        size="medium"
        name="email"
        fullWidth
        type="email"
      />
    </Grid>
    <Grid item xs={12} sm={6} data-aos="fade-up">
      <Button
        variant="outlined"
        component="label"
        color="primary"
        fullWidth
        size="large"
        className={classes.uploadButton}
      >
        <IconText
          fontIconClass="fas fa-cloud-upload-alt"
          color={theme.palette.primary.main}
          title="Upload Image"
          typographyProps={{
            className: classes.iconText,
          }}
        />
        <input
          type="file"
          multiple
          hidden
          accept="image/*"
          onChange={(e) => {uploadImage(e);}}
        />
      </Button>
    </Grid>
    </>
  }

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Pneummonia Detector"
        subtitle="Upload your image and we will classify it for you"
        subtitleProps={{
          variant: 'body1',
          color: 'textPrimary',
        }}
        data-aos="fade-up"
        align={isMd ? 'center' : 'left'}
      />
      <div className={classes.form}>
        <Grid container spacing={isMd ? 4 : 2}>
          {showResults}
          {showForm}
        </Grid>
      </div>
    </div>
  );
};

Application.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Application;
