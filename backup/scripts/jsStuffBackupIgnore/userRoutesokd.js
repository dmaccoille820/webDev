import express from 'express';
import { sessionMiddleware } from '../middleware/sessionMiddleware.js';
import * as userModel from "../models/registerLoginModel.js";


    const router = express.Router();

    router.get('/', sessionMiddleware, async (req, res) => {
      try {
        console.log('/api/user-data route handler');
        
        if(!req.user || !req.user.user_id){
          return res.status(401).json({message: 'User not authenticated'});
        }

        const userId = req.user.user_id;
        console.log('userId:', userId);

        try {
          const userData = await userModel.findUserById(userId);

            if (!userData) {
              return res.status(404).json({ message: 'User not found' });
            }

          res.json({ name: userData.name }); // Send the user's name
        } catch(error){
            console.error('Error getting user data', error);
            return res.status(500).json({message: "Internal server error"});
        }
        
      } catch (error) {
        console.error('Error getting user data', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    export default router;
