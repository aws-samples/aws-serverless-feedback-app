- ### Common Issues

  - #### Error message "Oops! A little glitch, can you try again please!" returned while submitting a feedback

    - #### Resolution

    1. Navigate to the API Gateway Console
    <p align="center">
      <img src="images/cors_001.png" alt="API"/>
    </p>

    2. Select the /submit-feedback API
    <p align="center">
      <img src="images/cors_002.png" alt="API"/>
    </p>

    3. Via the Action Menu, select the "Enable CORS"
    <p align="center">
      <img src="images/cors_003.png" alt="API"/>
    </p>

    4. Select "Enable CORS and replace existing CORS headers"
    <p align="center">
      <img src="images/cors_004.png" alt="API"/>
    </p>

    5. Via the Action Menu, select the "Deploy API"
    <p align="center">
      <img src="images/cors_005.png" alt="API"/>
    </p>

    6. Select "Prod" as the Deployment stage and select "Deploy"
    <p align="center">
      <img src="images/cors_006.png" alt="API"/>
    </p>
