package cordova.plugin.intent;

import android.widget.Toast;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.graphics.Rect;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.ViewTreeObserver.OnGlobalLayoutListener;
import android.view.inputmethod.InputMethodManager;

import java.util.HashMap;
import java.util.Map;

import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;
import android.text.Html;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.PluginResult;
import java.lang.reflect.Method;
import android.os.StrictMode;
import java.io.File;
import android.os.Environment;

// import additionally required classes for calculating screen height
import android.view.Display;
import android.graphics.Point;
import android.os.Build;
import android.widget.FrameLayout;
import static android.os.Environment.getExternalStoragePublicDirectory;

public class WebIntent extends CordovaPlugin {
    private OnGlobalLayoutListener list;
    private View rootView;
    private View mChildOfContent;
    private int usableHeightPrevious;
    private FrameLayout.LayoutParams frameLayoutParams;
	
	// PLUGIN ACTION
	private static final String GET_DIRECTORY = "GET_DIRECTORY";
	private static final String GET_FLAGS = "GET_FLAGS";
	private static final String INVOKE = "INVOKE";
	
	// INTENT ACTION
	private static final String PLAY = "PLAY"; // {directory, file}
	private static final String PLAY = "LIS"; // {directory}

	// FOLDERS
	private static final String MUSIC_DIR = "MUSIC";
	private static final String DOCS_DIR = "DOCUMENTS";
	
	
	private static final String KEY_ACTION = "ACTION";
	private static final String KEY_DATA_AND_TYPE = "DATA_AND_TYPE";
	
	private static Map<String, String> pathMap = new HashMap<String, String>();

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
		pathMap.put(MUSIC_DIR, Environment.DIRECTORY_MUSIC);
		pathMap.put(DOCS_DIR, Environment.DIRECTORY_DOCUMENTS);
    }

    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
	   
		//Toast.makeText(cordova.getActivity(), "Action: " + action, Toast.LENGTH_LONG).show();
	   
	   if (action == null) 
		   return false;
	   
			switch(action.toUpperCase()){
					case INVOKE : {
							//String intentAction = action;
							JSONObject params = args.getJSONObject(0);
							switch (params.getString("action")) {
								case PLAY: {
									String directory = params.getString("directory");
									String file = params.getString("file");
									Intent i = intentPlay(directory, file);
									cordova.getThreadPool().execute(new Runnable() {
										public void run() {
											cordova.getActivity().startActivity(i);
											//((InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE)).toggleSoftInput(0, InputMethodManager.HIDE_IMPLICIT_ONLY);
											callbackContext.success(); // Thread-safe.
										}
									});
									break;
								}
								case LIST: {
									JSONArray result = new JSONArray();
									String directory = params.getString("directory");
									String path = getFilePath(directory, null);
									File directoryFile = new File(path);
									Log.d("Files", "Path: " + path);
									File[] files = directoryFile.listFiles();
									Log.d("Files", "Size: " + files.length);
									for (int i = 0; i < files.length; i++) {
										Log.d("Files", "FileName:" + files[i].getName());
										result.put(files[i].getName());
									}
									
									cordova.getThreadPool().execute(new Runnable() {
										public void run() {
											//((InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE)).toggleSoftInput(0, InputMethodManager.HIDE_IMPLICIT_ONLY);
											callbackContext.success(result); // Thread-safe.
										}
									});
									break;
								}
							}
														
							//Toast.makeText(cordova.getActivity(), "sonoquellonuovo : " + args, Toast.LENGTH_LONG).show();
									
							
						break;}
					case GET_FLAGS : {break;}
			}

            return true;
    }

    private Intent intentPlay(String directory, String file){
				
        if (Build.VERSION.SDK_INT >= 24)
        {
            try
            {
                Method m = StrictMode.class.getMethod("disableDeathOnFileUriExposure");
                m.invoke(null);
            }
            catch (Exception e) {
            e.printStackTrace();
        }
        }

        Intent intent = new Intent(Intent.ACTION_VIEW);
		Uri myImagesdir = Uri.parse("file://" + getFilePath(directory, file));
        intent.setDataAndType(myImagesdir, "*/*");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setPackage("com.google.android.music");
        return intent;
    }
	
	private String getFilePath(String dir, String file){
		if (file == null)
			return getExternalStoragePublicDirectory(pathMap.get(dir)).toString();
		return new File(getExternalStoragePublicDirectory(pathMap.get(dir)), file).getPath();
	}

    @Override
    public void onDestroy() {
        rootView.getViewTreeObserver().removeOnGlobalLayoutListener(list);
    }

}
