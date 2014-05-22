---
layout: post
title: "Scheduling a Notification With Sound"
categories: 
- blog
---

Trigger a UILocalNotification with a sound after the timer has reached zero.
<!-- more -->

[**Use case and source in AlarmClock project on github**](https://github.com/connyr/ios-projects/tree/master/Numbers/AlarmClock)

The *countdown* method usually just counts down the current timer interval, but as soon as 0 is reached, an alert or notifcation should be shown.

    - (void)countDown
    {
        if (self.currentTimeInterval < 1) {
            [self.timer invalidate];
            [self countDownFinished];
        } else {
            self.currentTimeInterval--;
            dispatch_async(dispatch_get_main_queue(), ^(void) {
                [[self getTimerView] updateTimerWithTimeInterval:self.currentTimeInterval];
            });
        }
    }

The *countDownFinished* method checks the application state and either triggers a UIAlert or schedules a notification

    - (void)countDownFinished
    {
        if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
            [self showCountDownFinishedAlert];
        } else {
            [self showCountDownFinishedNotification];
        }
        [[self getControlsView] reset];
    }

If the application is in the foreground, we will show an alert (playing a sound requries additional code).

    - (void)showCountDownFinishedAlert
    {
        UIAlertView* alertView = [[UIAlertView alloc] initWithTitle:@"Timer finished"
                                                            message:@"Dismiss to Close."
                                                           delegate:self
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
        //[self playSound];
        [alertView show];
    }

 If the app is in the background, I schedule a local notification using the UILocalNotification class with the system's default sound, display a badge on the app icon and a message.

    - (void)showCountDownFinishedNotification
    {
        UILocalNotification* localNotification = [[UILocalNotification alloc] init];
        localNotification.fireDate = [NSDate date];
        localNotification.soundName = UILocalNotificationDefaultSoundName;
        localNotification.applicationIconBadgeNumber = 1;
        localNotification.alertBody = @"Timer finished";
        [[UIApplication sharedApplication]  scheduleLocalNotification:localNotification];
    }

And Done.

#### Fin