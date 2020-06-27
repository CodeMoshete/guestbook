    using UnityEngine;

public class Meteor : MonoBehaviour
{
    private const float VELOCITY_MULT = 0.65f;
    private Vector3 velocity;

    public void Initialize(Vector3 vel)
    {
        velocity = vel;
    }

    private void Update()
    {
        float falloffMult = 1f - (Time.deltaTime * VELOCITY_MULT);
        velocity *= falloffMult;
        Vector3 delta = velocity * Time.deltaTime;
        transform.Translate(delta);
    }
}
