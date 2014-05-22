---
layout: post
title: "Timer Countdown in the Background"
categories: 
- blog
---

Making a Timer app slowly countdown to zero even if the app enters the background.
<!-- more -->

[**Use case and source in AlarmClock project on github**](https://github.com/connyr/ios-projects/tree/master/Numbers/AlarmClock)

    - (void)scheduleCountDown
    {
        self.backgroundTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
            NSLog(@"Background handler called. Not running background tasks anymore.");
            [[UIApplication sharedApplication] endBackgroundTask:self.backgroundTask];
            self.backgroundTask = UIBackgroundTaskInvalid;
                                                                 }];
        self.isActive = YES;
        self.timer = [NSTimer timerWithTimeInterval:1.0
                                             target:self
                                           selector:@selector(countDown)
                                           userInfo:nil
                                            repeats:YES];
        NSRunLoop* runloop = [NSRunLoop currentRunLoop];
        [runloop addTimer:self.timer
                  forMode:NSRunLoopCommonModes];
        [runloop addTimer:self.timer
                  forMode:UITrackingRunLoopMode];
    } 

The countdown function

    - (void)countDown
    {
        self.currentTimeInterval--;
        [self validateTimer];
    }

We also check if zero is reached and update the timer view with the current time interval.

    - (void)validateTimer
    {
        if (self.currentTimeInterval < 1) {
            [self.timer invalidate];
            [self countDownFinished];
        } else {
            if (UIApplication.sharedApplication.applicationState == UIApplicationStateActive) {
                [[self getTimerView] updateTimerWithTimeInterval:self.currentTimeInterval];
            }
            NSLog(@"App is backgrounded, timer at %f", self.currentTimeInterval);
            NSLog(@"Background time remaining = %.1f seconds", [UIApplication sharedApplication].backgroundTimeRemaining);
        }
    }

**Open Questions/Problems**

 + According to Apple's guidelines, only apps with specific background tasks (play/record music, location updates,..) are allowed to run in the background for a longer period of time
 + Apps that don't fit into those categories can run for some time in the background, until they are suspended and don't execute any code anymore
 + This timer in this app continues counting down when the app enters the background, but when *[UIApplication sharedApplication].backgroundTimeRemaining* reaches 0, the app is suspended and we cannot alert the user anymore.

Conny



