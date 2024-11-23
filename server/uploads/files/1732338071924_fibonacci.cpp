#include <iostream>
using namespace std;

int main()
{
    int t1 = 0, t2 = 1, nt;
    int n, count = 2;
    cout << "Enter number : ";
    cin >> n;

    cout << "Fibinacci series....\n";
    cout << "0 1 ";
    while (count < n)
    {
        nt = t1 + t2;
        t1 = t2;
        t2 = nt;

        cout << nt << " ";

        count++;
    }
}