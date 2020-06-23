using UnityEngine;
using UnityEngine.UI;

public enum FadeState
{
    Hidden,
    ShowDelay,
    FadeIn,
    Displaying,
    FadeOut
}

public class MessageContainer : MonoBehaviour
{
    private const float DELAY_TIME = 2f;
    private const float FADE_TIME = 1f;
    private const float DISPLAY_TIME = 5f;

    public Text NameField;
    public Text MessageField;
    public CanvasGroup Canvas;
    public FadeState CurrentState { get; private set; }
    private float displayTime;

    public void ShowMessage(string name, string message)
    {
        if (CurrentState == FadeState.Hidden)
        {
            CurrentState = FadeState.ShowDelay;
            NameField.text = name;
            MessageField.text = message;
            displayTime = DELAY_TIME;
        }
    }

    private void Update()
    {
        displayTime -= Time.deltaTime;
        float pct = 0f;

        switch(CurrentState)
        {
            case FadeState.ShowDelay:
                if (displayTime <= 0)
                {
                    CurrentState = FadeState.FadeIn;
                    displayTime = FADE_TIME;
                }
                break;
            case FadeState.FadeIn:
                pct = Mathf.Min(1f - (displayTime / FADE_TIME), 1f);
                Canvas.alpha = pct;
                if (displayTime <= 0)
                {
                    CurrentState = FadeState.Displaying;
                    displayTime = DISPLAY_TIME;
                }
                break;
            case FadeState.Displaying:
                if (displayTime <= 0)
                {
                    CurrentState = FadeState.FadeOut;
                    displayTime = FADE_TIME;
                }
                break;
            case FadeState.FadeOut:
                pct = Mathf.Max(displayTime / FADE_TIME, 0f);
                Canvas.alpha = pct;
                if (displayTime <= 0)
                {
                    CurrentState = FadeState.Hidden;
                }
                break;
        }
    }
}
