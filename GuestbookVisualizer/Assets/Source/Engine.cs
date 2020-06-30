using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[System.Serializable]
public class EntryResponse
{
    public string name;
    public string message;
}

public class Engine : MonoBehaviour
{
    private const float QUERY_TIME = 1f;
    private const float QUERY_CHANCE = 0.067f;

    public GameObject FireworkEffect;
    public List<MessageContainer> MessageContainers;
    private float queryTime;

    private void Start()
    {
        queryTime = QUERY_TIME;
    }

    private void Update()
    {
        if (Input.GetKey(KeyCode.Escape))
        {
            Application.Quit();
            return;
        }

        queryTime -= Time.deltaTime;
        if (queryTime <= 0f)
        {
            queryTime = QUERY_TIME;
            if (Random.Range(0f, 1f) <= QUERY_CHANCE)
            {
                StartCoroutine(RequestEntry());
            }
        }
    }

    private IEnumerator RequestEntry()
    {
        UnityWebRequest www = UnityWebRequest.Get("http://18.191.101.1:8080/guestbook/getRandomGuestbookMessage");
        yield return www.SendWebRequest();
        EntryResponse response = JsonUtility.FromJson<EntryResponse>(www.downloadHandler.text);
        ShowFireworkMessage(response.name, response.message);
    }

    private void ShowFireworkMessage(string name, string message)
    {
        for (int i = 0, count = MessageContainers.Count; i < count; ++i)
        {
            MessageContainer container = MessageContainers[i];
            if (container.CurrentState == FadeState.Hidden)
            {
                container.ShowMessage(name, message);
                GameObject.Instantiate(FireworkEffect);
                break;
            }
        }
    }
}
