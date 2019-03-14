package com.masteratul.exceptionhandler;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class DefaultErrorScreen extends Activity {
    private static String TAG = "RN_ERROR_HANDLER";
    private Button quitButton;
    private Button relaunchButton;
    private Button showDetailsButton;
    private TextView stackTraceView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String stackTraceString = "StackTrace unavailable";
        try {
            stackTraceString = getIntent().getExtras().getString("stack_trace_string");
        }
        catch (Exception e) {
            Log.e(TAG, String.format("Was not able to get StackTrace: %s", e.getMessage()));
        }
        setContentView(R.layout.default_error_screen);
        quitButton = (Button) findViewById(R.id.eh_quit_button);
        relaunchButton = (Button) findViewById(R.id.eh_restart_button);
        showDetailsButton = (Button) findViewById(R.id.eh_show_details_button);
        stackTraceView = (TextView) findViewById(R.id.eh_stack_trace_text_view);
        stackTraceView.setText(stackTraceString);

        showDetailsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int stackTraceViewVisibility = stackTraceView.getVisibility();
                if(stackTraceViewVisibility == View.VISIBLE){
                    stackTraceView.setVisibility(View.GONE);
                    showDetailsButton.setText("SHOW DETAILS");
                }else{
                    stackTraceView.setVisibility(View.VISIBLE);
                    showDetailsButton.setText("HIDE DETAILS");
                }
            }
        });

        relaunchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                doRestart(getApplicationContext());
            }
        });

        quitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                System.exit(0);
            }
        });
    }

    public static void doRestart(Context c) {
        try {
            if (c != null) {
                PackageManager pm = c.getPackageManager();
                if (pm != null) {
                    Intent mStartActivity = pm.getLaunchIntentForPackage(
                            c.getPackageName()
                    );
                    if (mStartActivity != null) {
                        mStartActivity.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        int mPendingIntentId = 654311;
                        PendingIntent mPendingIntent = PendingIntent
                                .getActivity(c, mPendingIntentId, mStartActivity,
                                        PendingIntent.FLAG_CANCEL_CURRENT);
                        AlarmManager mgr = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
                        mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 100, mPendingIntent);
                        System.exit(0);
                    } else {
                        throw new Exception("Was not able to restart application, mStartActivity null");
                    }
                } else {
                    throw new Exception("Was not able to restart application, PM null");
                }
            } else {
                throw new Exception("Was not able to restart application, Context null");
            }
        } catch (Exception ex) {
            Log.e(TAG, "Was not able to restart application");
        }
    }
}
