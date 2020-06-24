using UnityEngine;

public class Meteor : MonoBehaviour
{
    private Vector3 velocity;

    public void Initialize(Vector3 vel)
    {
        velocity = vel;
    }

    private void Update()
    {
        Vector3 delta = velocity * Time.deltaTime;
        transform.Translate(delta);
    }
}
